import { useState, useEffect, Suspense, lazy } from "react";
import { Button } from "@/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/ui/dialog";
import { DialogHeader } from "@/ui/dialog";
import { toast } from "sonner";
import svg from "@/assets/usb-mark-material-svgrepo-com.svg";
import arduinoSVG from "@/assets/arduino.svg";
import type { SerialPort } from "@/core/types";
import { useSendCodeMutation, useCompileCodeMutation } from "@/service/compilerPayload";
import { useSelector } from "react-redux";
import { selectEditor } from "../editorSlice";
import generateCompilerPayload from "@/service/generateCompilerPayload";
import { WebSerialStream } from "@/core/WebSerialDuplexStream";
import Stk500 from "stk500-esm";

const LazyMonacoEditor = lazy(() => import('../components/MonacoEditor'));

interface CodeCardProps {
    isOpen: boolean;
}

const CodeCard: React.FC<CodeCardProps> = ({ isOpen }) => {

    const [code, setCode] = useState<string>('');
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    
    const [compilerPayload, { data, isLoading, error, isSuccess }] = useSendCodeMutation();
    const [compileCode, { isLoading: isCompiling }] = useCompileCodeMutation();
    const { nodes, edges, validatedPinsMap: validatedPinsMapArray } = useSelector(selectEditor);
    const validatedPinsMap = new Map(validatedPinsMapArray);

   
    const [port, setPort] = useState<SerialPort | null>(null);
    const [serialStatus, setSerialStatus] = useState<string>("Desconectado");
    const [isFailed, setIsFailed] = useState(false);
    const [progress, setProgress] = useState<number>(0);

    useEffect(() => {
        if (data?.generatedCode) {
            setCode(data.generatedCode);
            setIsEditing(false);
        }
    }, [data]);

    useEffect(() => {
        if ("serial" in navigator) {
            console.log("Web Serial API is ON");
        } else {
            console.error("Web Serial API is not supported in this browser");
            toast.error("A API Web Serial não é suportada neste navegador.");
        }
    }, []);

    useEffect(() => {
        if (isFailed) {
            toast.error("Ops! Algo deu errado ao tentar conectar com a placa");
        }
        setIsFailed(false);
    }, [isFailed]);

    const handleCodeChange = (value: string | undefined) => {
        setCode(value || '');
    }

    const handleEnabledEditing = () => setIsEditing(true);

    const handleRestoreOriginal = () => {
        if (data?.generatedCode) {
            setCode(data.generatedCode);
            setIsEditing(false);
        }
    }

    const handleGenerateCode = () => {
        if (nodes.length > 0 && edges.length > 0) {
            const payload = generateCompilerPayload(nodes, edges, validatedPinsMap);
            compilerPayload(payload);
        } else {
            toast.error("Não há circuito para gerar o código.");
        }
    };

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => {
        setIsModalOpen(false);
        if (!port) {
            setSerialStatus("Desconectado");
            setProgress(0);
        }
    };

    const connectSerial = async () => {
        try {
            if (port) {
                toast.warning("Uma porta já está selecionada.");
                return;
            }
            const requestedUserPort: SerialPort = await navigator.serial.requestPort();
            setPort(requestedUserPort);
            setSerialStatus("Placa Selecionada");
            toast.success("Placa selecionada com sucesso!");

        } catch (error: any) {
            console.error("Error when selecting serial port", error);
            setSerialStatus(`Ops! Falha ao selecionar a porta`);
            setIsFailed(true);
        }
    };

    const flashFirmware = async (hex: string) => {
        if (!port) return;

        let transport: WebSerialStream | null = null;
        try {
            setSerialStatus("Abrindo porta...");
            await port.open({ baudRate: 115200 });
            
            transport = new WebSerialStream(port);

            setSerialStatus("Iniciando gravação...");
            setProgress(0);

            const board = {
                name: "Arduino Uno",
                baudRate: 115200,
                signature: new Uint8Array([0x1e, 0x95, 0x0f]),
                pageSize: 128,
                timeout: 400,
            };

            const stk = new Stk500(transport as any, board);

            await stk.bootload(hex, (percentage) => {
                const percent = Math.round(percentage);
                setProgress(percent);
                setSerialStatus(`Gravando - ${percent}%`);
            });

            setSerialStatus("Projeto gravado com sucesso!");
            toast.success("Firmware gravado com sucesso na placa!");
            setTimeout(() => handleCloseModal(), 2000);

        } catch (error) {
            console.error("Error when trying to write on the board", error);
            setSerialStatus("Falha ao tentar gravar na placa");
            toast.error("Falha ao gravar na placa.", { description: String(error) });
        } finally {
            if (transport) {
                transport.destroy();
            } else if (port?.readable) {
                await port.close();
            }
            setPort(null);
        }
    };

    const writerFirmware = async () => {
        if (!port || !data) {
            toast.error("Conecte a placa e gere o código primeiro.");
            return;
        }

        if (isEditing && code !== data.generatedCode) {
            setSerialStatus("Compilando alterações...");
            try {
                const compileResult = await compileCode({ code, board: 'uno' }).unwrap();
                await flashFirmware(compileResult.hex);
            } catch (compileError) {
                console.error("Failed to re-compile edited code", compileError);
                toast.error("Falha ao compilar o código editado.", { description: String(compileError) });
                setSerialStatus("Falha na compilação");
            }
        } else {
            await flashFirmware(data.hex);
        }
    };

    const renderContent = () => {
        if (isLoading) {
            return <p className="mt-10">Gerando Código com I.A....</p>;
        }
        if (error) {
            return <p className="text-red-400 mt-10">Ops, ocorreu um erro ao gerar o código.</p>;
        }
        if (isSuccess && data) {
            return (
                <>
                    <div className="flex-grow w-full min-h-0 text-left mt-2">
                        <Suspense fallback={<div>Carregando Editor...</div>}>
                            <LazyMonacoEditor
                                width="100%"
                                height="100%"
                                language="cpp"
                                theme="vs-dark"
                                value={code}
                                onChange={handleCodeChange}
                                options={{ readOnly: !isEditing }}
                            />
                        </Suspense>
                    </div>
                    <div className="w-full mt-4 flex-col space-x-20">
                        {!isEditing ? (
                            <Button
                                className="bg-green-600 hover:bg-green-700 border border-gray-800"
                                onClick={handleEnabledEditing}
                            >
                                Habilitar Edição
                            </Button>
                        ) : (
                            <Button className="bg-yellow-600 hover:bg-yellow-700"
                                onClick={handleRestoreOriginal}
                            >
                                Restaurar Original
                            </Button>
                        )}
                        <Button
                            className="mt-2 text-black mb-2 cursor-pointer hover:bg-gray-700 border border-black bg-white hover:text-white"
                            onClick={handleOpenModal}
                            disabled={isCompiling}
                        >
                            {isCompiling ? 'Compilando...' : 'Gravar Código'}
                        </Button>
                    </div>
                </>
            );
        }
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <p className="mb-4">Sua simulação está rodando!</p>
                <Button 
                className="border border-white bg-gray-800"
                onClick={handleGenerateCode}
                >Gerar Código
                </Button>
            </div>
        );
    };

    return (
        <>
            <div
                className={`bg-[#1E1E1E] border text-white text-center h-full flex flex-col items-center absolute top-0 left-0 z-10 transition-all duration-300 font-semibold text-1xl pt-2 rounded-br-sm rounded-tr-sm
                ${isOpen ? "w-1/4" : "w-0"} overflow-hidden
            `}>
                <h1 className="text-lg font-medium mb-2 w-full">
                    Painel de Código
                </h1>
                <hr className="w-1/2 mb-2" />
                {renderContent()}
            </div>

            <Dialog open={isModalOpen} onOpenChange={(open) => !open && handleCloseModal()}>
                <DialogContent className="sm:max-w-[425px] text-black bg-slate-200">
                    <DialogHeader className=" ">
                        <DialogTitle className="text-lg text-center">
                            {port ? "Placa Conectada" : "Conecte seu Arduino"}
                        </DialogTitle>
                        <DialogDescription className="text-center text-md">
                            {port ? `Status: ${serialStatus}` : "Use nossa tecnologia e conecte sua placa ao seu projeto!"}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-3">
                        <div className="flex font-bold text-[40px] justify-center grid-cols-3 justify-self-center items-center gap-4">
                            <img src={svg} className="h-20" />+
                            <img src={arduinoSVG} className="h-20" />
                        </div>
                        {progress > 0 && (
                            <div className="w-full bg-gray-300 rounded-full h-2.5">
                                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        {!port ? (
                            <Button
                                onClick={connectSerial}
                                className="cursor-pointer hover:bg-blue-700 border hover:text-white"
                            >
                                Verificar Placa
                            </Button>
                        ) : (
                            <Button
                                onClick={writerFirmware}
                                className="cursor-pointer bg-green-600 hover:bg-green-700 border hover:text-white"
                                disabled={isCompiling}
                            >
                                {isCompiling ? 'Compilando...' : 'Enviar Código Agora'}
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
export default CodeCard
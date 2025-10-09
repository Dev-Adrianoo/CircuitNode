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
import { useSendCodeMutation } from "@/service/compilerPayload";
import { useSelector } from "react-redux";
import { selectEditor } from "../editorSlice";
import generateCompilerPayload from "@/service/generateCompilerPayload";

const LazyMonacoEditor = lazy(() => import('../components/MonacoEditor'));

interface CodeCardProps {
    isOpen: boolean;
}

const CodeCard: React.FC<CodeCardProps> = ({ isOpen }) => {

    const [code, setCode] = useState<string>('');
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    
    const [compilerPayload, { data, isLoading, error, isSuccess }] = useSendCodeMutation();
    const { nodes, edges, validatedPinsMap: validatedPinsMapArray } = useSelector(selectEditor);
    const validatedPinsMap = new Map(validatedPinsMapArray);

   
    const [port, setPort] = useState<SerialPort | null>(null);
    const [, setReader] = useState<ReadableStreamDefaultReader | null>(null);
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
                toast.warning("Uma porta já está conectada.");
                return;
            }
            const requestedUserPort: SerialPort = await navigator.serial.requestPort();
            await requestedUserPort.open({ baudRate: 115200 });

            setPort(requestedUserPort);
            setSerialStatus("Conectado");
            toast.success("Placa conectada com sucesso!");

            const textDecoder = new TextDecoderStream();
            requestedUserPort.readable.pipeTo(textDecoder.writable as any);
            const newReader = textDecoder.readable.getReader();
            setReader(newReader);
            readSerialData(newReader);
        } catch (error: any) {
            console.error("Error when trying to connect Serial", error);
            setSerialStatus(`Ops! Algo falhou ao tentar conectar a sua placa`);
            setIsFailed(true);
        }
    };

    const readSerialData = async (currentReader: ReadableStreamDefaultReader) => {
        try {
            while (true) {
                const { value, done } = await currentReader.read();
                if (done) break;
                console.log("Data readed", value);
            } 
        } catch (error: any) {
            console.error("Error when reading data", error);
            setSerialStatus(`Erro ao ler dados: ${error.message}`);
        }
    };

    const writerFirmware = async () => {
        if (!port || !data?.generatedCode) {
            toast.error("Conecte sua placa e gere o código primeiro.");
            return;
        }
        setSerialStatus("Iniciando gravação...");
        try {
            const { default: Avrgirl } = await import('avrgirl-arduino');
            const avrGirl = new Avrgirl({
                board: 'uno',
                port: port as any, 
                debug: true
            });

            const hex = data.generatedCode;

            await new Promise<void>((resolve, reject) => {
                avrGirl.flash(hex, (error: Error | null) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve();
                });

                avrGirl.on('progress', (percentage: number) => {
                    const percent = Math.round(percentage * 100);
                    setProgress(percent);
                    setSerialStatus(`Gravando - ${percent}%`);
                });
            });

            setSerialStatus("Projeto gravado com sucesso!");
            toast.success("Firmware gravado com sucesso na placa!");
            setTimeout(() => handleCloseModal(), 2000);

        } catch (error) {
            console.error("Error when trying to write on the board", error);
            setSerialStatus("Falha ao tentar gravar na placa");
            toast.error("Falha ao gravar na placa.", { description: String(error) });
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
                        >
                            Gravar Código
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
                            >
                                Enviar Código Agora
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
export default CodeCard
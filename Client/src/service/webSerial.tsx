import React, { useEffect, useState } from "react";
import type { SerialPort } from "../core/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/ui/dialog";
import { DialogHeader } from "@/ui/dialog";
import { Button } from "@/ui/button";
import { toast } from "sonner";
import svg from "@/assets/usb-mark-material-svgrepo-com.svg"
import arduinoSVG from "@/assets/arduino.svg"


interface SerialProps{
  isSimulating:boolean;
}
const WebSerialAPI: React.FC<SerialProps> = ({isSimulating}) => {
  const [port, SetPort] = useState<SerialPort | null>(null);
  const [reader,  setReader] = useState<ReadableStreamDefaultReader | null>(
    null
  );
  void reader
  const [data, setData] = useState<string>("");
  void data
  const [status, setStatus] = useState<string>("Desconectado");
  const [isFailed, setIsFailed] = useState(false)

  
  useEffect(() => {
    if ("serial" in navigator) {
      console.log("Web Serial API is ON");
    } else {
      console.error("Web Serial API is not  supported in this browser");
    }
  }, []);
  const mockPort = {
    open:  ()=>  Promise.resolve(),
    close: () => Promise.resolve(),
    getInfo: () => ({ usbVendorid: 1, usbProductId: 2})
  }
  const mockAvrGirl ={
    flash:(port:any, options:any ) =>{
      void port
      options.onProgress(0),
      options.onProgress(50),
      options.onProgress(100)
      return new Promise(resolve => setTimeout(resolve, 20000))
    }
  }
  const mockWriterFirmware = async () =>{
    try{
      await mockAvrGirl.flash(mockPort,{
        board: 'uno',
        file: 'teste',
        onProgress:(percentage: number) =>{
            console.log("Percentage of completion of the task", percentage)
        }
      }

      )

    }catch(error){
      console.error("Mock wirting as gone failed ")
    }
  }
/*  
  const WriterFirmware = async () => {
    if (!port) {
      console.log("Conecte sua placa Arduino primeiro")
      return
    }
    setStatus("Iniciando gravação...")
    try{
      const avrGirl = new Avrgirl();
      await avrGirl.flash(port, {
        onprogress: (percent:number) =>{
          setProgress(percent)
          setStatus(`Gravando Dados-${percent.toFixed(0)}%`)
        },
        
      })
       setStatus("Projeto gravado com sucesso ")
    }catch(error){
        console.error("Error when trying to write on the board", error)
        setStatus("Falha ao tentar gravar na placa")
    }
  }
x*/
  const connectSerial = async () => {
    try {
      if (port) {
        console.warn("Already connected to a PORT");
        return;
      }
      const requestedUserPort: SerialPort =
        await navigator.serial.requestPort();
      await requestedUserPort.open({ baudRate: 115200 });

      SetPort(requestedUserPort);
      setStatus("Connected");
      const textDecoder = new TextDecoderStream();
      requestedUserPort.readable.pipeTo(textDecoder.writable);
      const newReader = textDecoder.readable.getReader();
      setReader(newReader);

      readSerialData(newReader);
    } catch (error: any) {
      console.error("Error when trying to read Serial", error);
      setStatus(
        `Ops! Algo falhou ao tentar conectar a sua placa`
      );
      setIsFailed(true)
    }
  };
  const readSerialData = async (currentReader: ReadableStreamDefaultReader) => {
    try {
      while (true) {
        const { value, done } = await currentReader.read();
        if (done) {
          console.log("reading is DONE");
          break;
        }
        setData((prevData) => prevData + value);
        console.log("Data readed", value);
      }
    } catch (error: any) {
      console.error("Error when reading data");
      setStatus(`Error: Failed to read data properly ${error.message}`);
    }
  };

  useEffect(() => {
    if (isFailed) {

      toast.error("Ops! Algo deu errado ao tentar conectar com a placa")

    }
    setIsFailed(false)
  }, [isFailed, status])
  return (
    <div>

      <Dialog>
        <DialogTrigger asChild>
          <button className={`p-1 font-medium absolute bottom-20 right-10 transition-all h-12 w-32 duration-200  transform  z-10 hover:shadow-[0px_0px_10px_2.5px_rgba(37,99,235,0.7)] hover:border-blue-300 text-[13.5px] text-center cursor-pointer text-black rounded-md bg-white
          ${isSimulating ?  "block" :  'hidden'}
          `}
          >
          Salve no arduino
          </button>
        </DialogTrigger>
        <DialogContent className=" sm:max-w-[425px]  text-black bg-slate-200">
          <DialogHeader className=" ">
            <DialogTitle className="text-lg text-center">
              Conecte seu Arduino
            </DialogTitle>
            <DialogDescription className="text-center text-md">Use nossa tecnologia e conecte sua placa ao seu projeto!</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-3">
            <div className=" flex  font-bold text-[40px] justify-center   grid-cols-3 justify-self-center items-center  gap-4">
              <img
                src={svg}
                className="h-20 "
              />+
              <img
                src={arduinoSVG}
                className="h-20"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={connectSerial}
              className="cursor-pointer hover:bg-blue-700 border hover:text-white "
              disabled={!!port}
            >Verificar Placa</Button>
            <Button

              className="cursor-pointer hover:bg-blue-700 border hover:text-white "
              onClick={mockWriterFirmware}
              disabled={!!port}
            >Gravar Código</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default WebSerialAPI;


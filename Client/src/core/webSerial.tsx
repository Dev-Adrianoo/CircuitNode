import type { ReadStream } from "fs";
import React, { useEffect, useState } from "react";
/*import Avrgirl from "avrgirl-arduino"7*/
import type { SerialPort } from "./types";
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




const WebSerialAPI: React.FC = () => {
  const [port, SetPort] = useState<SerialPort | null>(null);
  const [reader, setReader] = useState<ReadableStreamDefaultReader | null>(
    null
  );
  const [data, setData] = useState<string>("");
  const [status, setStatus] = useState<string>("Desconectado");
  const [isFailed, setIsFailed] = useState(false)
  const [progress, setProgress] = useState<number>(0)
  
  useEffect(() => {
    if ("serial" in navigator) {
      console.log("Web Serial API is ON");
    } else {
      console.error("Web Serial API is not  supported in this browser");
    }
  }, []);
  const WriterFirmware = async () => {
    if (!port) {
      console.log("Conecte sua placa Arduino primeiro")
      return
    }
    setStatus("Iniciando gravação...")
    /*try{
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
    }*/
  }
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
          <button className="p-1 transition-all h-12  duation-200  transform  hover:bg-gray-200 border hover:border-blue-300 text-[13.5px] text-center cursor-pointer text-black rounded-md bg-white"
          >
            Conecte seu Arduino
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
              onClick={WriterFirmware}
              disabled={!!port}
            >Gravar Código</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default WebSerialAPI;


import { Handle, Position, type NodeProps } from "reactflow";
import {memo, type MouseEvent} from "react";
import svg from "../../assets/arduino-svgrepo-com.svg"


//TODO: Pins para a board, cada pino com valor diferente
//:14 pinos digitais de 0 a 13
//:Os pinos digitais PWM são os 3,5,6,9,10,11 ---> permitem controle preciso sobre entrada de carga nos componentes, potencia de carga medida de 0 a 255 
//:6 pinos analogicos de A0 a A5
//TOTAL:20 pinos I/O (entrada e saida)!

const ArduinoUnoNode = ({id,data}: NodeProps) => {

      const onNodeRemove = (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      if(data.removeNodeFunc) {
         data.removeNodeFunc(id);
      }
   }
 
    return (

       <div className="relative bg-blue-400 border-2 border-stone-500 rounded-lg px-4 text-center w-60 h-45 shadow-md">
          <Handle
          type="target"
          position={Position.Left}
          id="input"
         //TODO ADICIONAR PADRÃO DE CORES DOS HANDLES
          className="!w-3 !h-3 !bg-teal-500 border-2 border-white"
          />

         <button
         onClick={onNodeRemove}
         className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center -mt-2 -mr-2 hover:bg-red-700 transition-colors text-sm font-mono cursor-pointer"
         aria-label="Remover nó"
         >
         X
         </button>

         {/*TODO: cada pino tem que ter um estado nulo no id padrão, 
         usuario que decide se é type input ou output e se a conexão 
         é do pino é PWD */}

         <div className="flex self-start justify-self-end border-1 border-black justify-center w-30">
             digital pins (14)
             <Handle 
             type="source"
             position={Position.Top}  
             className="!w-2 !h-2 "               
             />
         </div>
         <div className="flex  gap-1 justify-center self-center">
            <img src={svg} className="  h-5 w-5 mt-[1px] bg-black rounded-md">
            </img>
            <div className="font-bold text-gray-800">
            Arduino Uno
            </div>
         </div> 
          {data.label && <div className="text-sm mb-2 text-gray-600">{data.label}</div>}
          <Handle 
          type="source"
          position={Position.Right}
          id="ouput"
          className="!w-3 !h-3 !bg-red-500 border-2 border-white"
          />

          {/*TODO: cada pino tem que ter um estado nulo no id padrão, 
          usuario que decide se é type input ou output */}


          <div className="absolute flex  bottom-0 right-1 justify-self-end justify-around border-solid border-1 border-black w-30  ">
             analogic pins (6) 
               <Handle type="source"
               position={Position.Bottom}
               id="output"
               className="!w-2 !h-2 rounded-full bg-black left-20 !transform-none  !translate-x-1/2 !justify-self-end"/>
               <Handle type="source"
               position={Position.Bottom}
               id="input"
               className="!w-2 !h-2 rounded-full absolute bg-red-600 left-10 !transform-none !translate-x-10 "/>
               
          </div>  
       </div>
    )
}
export default memo(ArduinoUnoNode)
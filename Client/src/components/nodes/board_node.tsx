import { Handle, Position, type NodeProps } from "reactflow";
import {memo, type MouseEvent} from "react";
import svg from "../../assets/arduino-svgrepo-com.svg"

const BoardNode = ({id,data}: NodeProps) => {

      const onNodeRemove = (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      if(data.removeNodeFunc) {
         data.removeNodeFunc(id);
      }
   }

    return (

       <div className="relative bg-blue-400 border-2 border-stone-500 rounded-lg px-4 text-center w-40 shadow-md">
          <img src={svg} className="h-5 w-5 absolute top-15 right-0 ">
          </img>
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

          <div className="font-bold text-gray-800">
           Board Node
          </div>
          {data.label && <div className="text-sm mb-2 text-gray-600">{data.label}</div>}
          <Handle 
          type="source"
          position={Position.Right}
          id="ouput"
          className="!w-3 !h-3 !bg-red-500 border-2 border-white"
          />
       </div>
    )
}
export default memo(BoardNode)
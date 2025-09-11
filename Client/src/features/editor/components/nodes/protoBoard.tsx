import { Handle, Position, type NodeProps } from "reactflow";
import  {memo, type MouseEvent} from "react";
import svg from "@/assets/protoboard-svgrepo-com (3).svg"

const ProtoboardNode = ({id, data}: NodeProps) => {

   const onNodeRemove = (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      if(data.removeNodeFunc) {
         data.removeNodeFunc(id);
      }
   }

    return(

       <div className="relative bg-white border-2 border-stone-500 rounded-lg px-5 text-center w-40 shadow-md">
        
          <Handle
           type="target" 
           position={Position.Left } 
           id="input"
           className="!w-3 !h-3 !bg-teal-500 border-2 border-white"
           />  

            <button
            onClick={onNodeRemove}
            className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center -mt-2 -mr-2 hover:bg-red-700 transition-colors text-sm font-mono cursor-pointer"
            aria-label="Remover nó"
            
            >
            X
            </button>

          <div className="flex mt-2 justify-center gap-1 ">
            <img src={svg} className="mt-[1px] h-5 w-5 bg-black rounded-md"></img>
            <div className="font-bold text-gray-800">
               Protoboard Node
            </div>
          </div> 
          {data.label && <div className="text-sm text-gray-600">{data.label}</div>}

          <Handle
          type="source" 
          position={Position.Right} 
          id="output"
          className="!w-3 !h-3 !bg-red-500 border-2 border-white"
          />
       </div>
    );
}
export default memo(ProtoboardNode)
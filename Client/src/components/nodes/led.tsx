import { Handle, Position, type NodeProps } from "reactflow";
import { memo, type MouseEvent } from "react";
import svg from "../../assets/headlights-svgrepo-com (1).svg"
const LedNode = ({ id,data }: NodeProps) => {

    const onNodeRemove = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
      if(data.removeNodeFunc) {
         data.removeNodeFunc(id);
      }
   }

    return(
       <div className="relative  bg-red-500 border-2  border-stone-500 px-5 text-center w-15 h-20 shadow-md">
            <div className="absolute bottom-19 right-0 bg-red-500 w-full h-5 rounded-t-full items-end">


            </div>
            <button
            onClick={onNodeRemove}
            className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center -mt-2 -mr-2 hover:bg-red-700 transition-colors text-sm font-mono cursor-pointer"
            aria-label="Remover nó"
            >
            X
            </button>

            <div className="flex mt-2 gap-1 justify-center ">
               {/*<img src={svg} className=" absolute left-0 mt-[1px] bg-black rounded-full h-4 w-4"></img>*/}
               <div className="font-bold text-center text-sm z-50 text-white">
               Led Node
               </div>
            </div>
            {data.label && <p className="text-sm text-gray-800">{data.label}</p>}
         

            <div className=" justify-center  mt-2 ml-1.5 left-0 text-black absolute h-20 w-2 bg-gray-300">
               -
               <Handle
               type="source"
               position={Position.Bottom}
               id="output"
               className="!w-3 !h-3 !bg-red-500 border-2 border-white"
               />
            </div>

            <div className="justify-center text-center mt-2  text-black absolute right-0 mr-1.5 h-30 w-2 bg-gray-300">
               +
               <Handle
               type="target"
               position={Position.Bottom}
               id="input"
               className="!w-3 !h-3  !bg-teal-500 border-2 border-white"
               />
            </div>
       </div>   
    )
} 
export default memo(LedNode)
import { memo, type MouseEvent } from "react";
import { Handle, Position , type NodeProps} from "reactflow";
import svg from "../../assets/resistor-svgrepo-com.svg"


const ResistorNode =  ({ id, data }: NodeProps) => {

   const onNodeRemove = (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      if(data.removeNodeFunc) {
         data.removeNodeFunc(id);
      }
   }
   
   return(
      <div className="relative justify-center items-center bg-amber-500 rounded-lg px-5 text-center w-35 h-10 ">


            <div className="flex mt-2 justify-center items-center ">
               <img src={svg} className=" absolute bottom-2 left-0 mr-10 mt-[2px] h-5 w-5 bg-black rounded-full "></img>

               <div className="font-bold text-sm text-white  ">
               Resistor Node
               </div>
            </div>

            {data.label && <div className="text-sm text-gray-600">{data.label}</div>}

            <div className= " rounded-r-4xl z-[-1] absolute top-[-0.5rem] right-30   bg-amber-500 h-15 w-10">
               <Handle 
                  type="target"
                  position={Position.Left } 
                  id="input"
                  className="!w-3 !h-3 !bg-teal-500 border-2 border-white"
                  /> 
            </div>

            <div className=" z-[-1] rounded-l-4xl absolute h-15 w-10 left-30
            top-[-0.5rem] bg-amber-500">
               <button
               onClick={onNodeRemove}
               className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center -mt-2 -mr-2 hover:bg-red-700 transition-colors text-sm font-mono cursor-pointer"
               aria-label="Remover nó"
               >
               X
               </button>

               <Handle 
               type="source"
               position={Position.Right}
               id="output"
               className="!w-3 !h-3 !bg-red-500 border-2 border-white"
               />
           </div>
       </div>
    );
};
export default memo(ResistorNode)
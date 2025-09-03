import { Handle, Position } from "reactflow";
import React, {memo} from "react";

function LedNode(){
    return(
       <div className="bg-red-500 min-h-12 w-15 p-4 rounded-sm">
           <Handle type="target" position={Position.Bottom}/>
           Led Node
       </div>   
    )
} 
export default memo(LedNode)
import { Handle, Position } from "reactflow";
import React, {memo} from "react";

function ResistorNode (){
    return(
       <div className="bg-orange-500 min-h-15 w-15 text-center  ">
          <Handle type="target" position={Position.Left } />  
            Resistor Node
          <Handle type="source" position={Position.Right} />
       </div>
    );
}
export default memo(ResistorNode)
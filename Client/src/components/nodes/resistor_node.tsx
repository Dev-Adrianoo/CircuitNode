import { Handle, Position } from "reactflow";
import React, {memo} from "react";

function ResistorNode (){
    return(
       <div className="bg-orange-500 min-h-15 w-20 text-center p-4 rounded-sm">
          <Handle type="target" position={Position.Left } />  
            Resistor Node
          <Handle type="source" position={Position.Right} />
       </div>
    );
}
export default memo(ResistorNode)
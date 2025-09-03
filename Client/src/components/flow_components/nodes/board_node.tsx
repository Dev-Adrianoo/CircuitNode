import { Handle, Position } from "reactflow";
import React, {memo} from "react";

function BoardNode(){

    return (
       <div className="bg-blue-600 h-30 w-40">
          <Handle type="target" position={Position.Left} />
           Board Node
          <Handle type="source" position={Position.Right}/>
       </div>
    )
}
export default memo(BoardNode)
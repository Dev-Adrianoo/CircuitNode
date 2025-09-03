import { Handle, Position } from "reactflow";
import  {memo} from "react";
function DefaultNode (){
    return(
       <div className="bg-green-400 min-h-20 w-25 text-center ">
          <Handle type="target" position={Position.Left } />  
            starter Node
          <Handle type="source" position={Position.Right} />
       </div>
    );
}
export default memo(DefaultNode)
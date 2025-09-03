import ReactFlow,{Position,  addEdge, useEdgesState, useNodesState, type ReactFlowProvider } from "reactflow"
import { useCallback, useMemo } from "react"

import { DefaultNode, BoardNode, LedNode ,ResistorNode }  from "./nodes/index.ts"

const defaultNodeTypes= {
   
    start: DefaultNode,
    board: BoardNode, 
    led: LedNode,
    resistors: ResistorNode

}
const initialNodes= [
    {id:"1", type: "start", position:{x:10 , y:100}, data:{label: "Starter Node "}},
    {id:"2", type: "board", position:{x:130 , y:-20}, data:{label: " Action "}},
    {id:"3", type: "resistors", position:{x:310 , y:-80}, data:{label: "Starter Node "}},
    {id:"4", type: "led", position:{x:420, y:-130}, data:{label: " Action "}},
]
const initialEdges=[

    {id:"e1-2", source: "1", target:"2" },
    {id:"e2-1", source: "2", target:"1"}, 
]
export default function FlowRender(){

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

   return(
      <div className=" flex justify-self-center self-center h-screen w-2/3 border-solid border-2 border-black bg-gray-100">
        <ReactFlow
       
           nodes={nodes}
           edges={edges}
           onNodesChange={onNodesChange}
           onEdgesChange={onEdgesChange}    
           nodeTypes={defaultNodeTypes}
           
           />
       </div>
     )
}
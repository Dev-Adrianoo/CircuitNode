import * as React from "react";
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  useReactFlow,
  type Connection,
  type Edge
} from "reactflow"

import  DefaultNode  from "../nodes/default_node"
import  BoardNode  from "../nodes/board_node"
import  LedNode  from "../nodes/led_node"
import  ResistorNode  from "../nodes/resistor_node"


const nodeTypes = {
  start: DefaultNode,
  board: BoardNode,
  led: LedNode,
  resistors: ResistorNode
}

const InitialNodes = [
  { id: '1', type: 'start', position: {x: 10, y: 100}, data: { label: 'Starter Node' } },
  { id: '2', type: 'board', position: { x: 250, y: 150 }, data: { label: 'Board Node' } },
  { id: '3', type: 'resistors', position: { x: 500, y: 300 }, data: { label: 'Resistor Node' } },
  { id: '4', type: 'led', position: { x: 500, y: 150 }, data: { label: 'LED Node' } },
]

const initialNodes: any[] = []; 
const initialEdges: Edge[] = [];


export default function FlowCanvas() {

  const reactFlowWrapper = React.useRef<HTMLDivElement>(null);
  const [nodes , setNodes , onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] =  useEdgesState(initialEdges)
  const { project } = useReactFlow();

  const nodeIdCounter = React.useRef(0);
  const getId = React.useCallback(() => `dnd-node_${nodeIdCounter.current++}`, [])

  const onConnect = React.useCallback (
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  )

  const onDragOver = React.useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = React.useCallback(

    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      if(typeof type === 'undefined' || !type) {
        return;
      }

      const position = project ({
        x: event.clientX,
        y: event.clientY
      });
      
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node` },
      };
     
      setNodes((nds) => nds.concat(newNode));
    },
    [project, setNodes])
  

  return (
    <div className="flex-grow h-full" ref={reactFlowWrapper} >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onDragOver={onDragOver}
        onDrop={onDrop}
        fitView
        className="bg-gray-500"
        >
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          <Controls />
        </ReactFlow>
      </div>
  )
}
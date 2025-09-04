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
  type Edge,
  type Node,
} from "reactflow"


import { nodeTypes } from "../nodes/index";

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

const proOptions = { hideAttribution: true };
const defaultEdgeOptions = { style: { strokeDasharray: '5.5' } };

const FlowCanvas: React.FC = () => {

  const reactFlowWrapper = React.useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const { screenToFlowPosition } = useReactFlow();

  const nodeIdCounter = React.useRef(0);
  const getId = React.useCallback(() => `dnd-node_${nodeIdCounter.current++}`, []);

  const removeNode = React.useCallback(
    (nodeIdToRemove: string) => {
      setNodes((currentNodes) => currentNodes.filter((node) => node.id !== nodeIdToRemove));
      setEdges((currentEdges) =>
        currentEdges.filter((edge) => edge.source !== nodeIdToRemove && edge.target !== nodeIdToRemove)
      );
    },
    [setNodes, setEdges]
  );

  const onConnect = React.useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onDragOver = React.useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node`, removeNodeFunc: removeNode },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes, getId, removeNode]
  );


  return (
    <div className="w-full h-full" ref={reactFlowWrapper} >
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
        proOptions={proOptions}
        defaultEdgeOptions={defaultEdgeOptions}
        className="bg-gray-500"
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default FlowCanvas;
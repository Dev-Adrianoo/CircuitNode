import { useState, useCallback, useRef,  } from "react";
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
import type { AppNode, AnyComponentData } from "@/types"
import { ConfigurationModal } from "../ConfigurationModal";
import { nodeTypes } from "../nodes/index";
import StartButton from "./StartWorkflowBtn";

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

const proOptions = { hideAttribution: true };
const defaultEdgeOptions = { style: { strokeDasharray: '5.5' } };

const FlowCanvas: React.FC = () => {

  
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const { screenToFlowPosition, getNodes, addNodes } = useReactFlow();

  const [editingNode, setEditingNode] = useState<AppNode | null>(null); 

  const nodeIdCounter = useRef(0);
  const getId = useCallback(() => `dnd-node_${nodeIdCounter.current++}`, []);

  const onNodeClick = useCallback((event: React.MouseEvent, node: AppNode) => {
    setEditingNode(node);
  }, [])

  const removeNode = useCallback(
    (nodeIdToRemove: string) => {
      setNodes((currentNodes) => currentNodes.filter((node) => node.id !== nodeIdToRemove));
      setEdges((currentEdges) =>
        currentEdges.filter((edge) => edge.source !== nodeIdToRemove && edge.target !== nodeIdToRemove)
      );
    },
    [setNodes, setEdges]
  );

    const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );


  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
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
        data: { label: `${type}`, resistence: 2000, removeNodeFunc: removeNode },
      };

     setEditingNode(newNode);
    },
    [screenToFlowPosition, getId, removeNode]
  );

  const handleCloseModal = () => {
    if(editingNode) {
      const allNodes = getNodes()
      const nodeExists = allNodes.find((n) => n.id === editingNode.id);

      if(!nodeExists) {
        addNodes(editingNode)
      }
    }
    setEditingNode(null)
  }

  const handleSave = (node: AppNode, data: AnyComponentData) => {
    const allNodes = getNodes();
    const nodeExists = allNodes.find((n) => n.id === node.id)

    const updatedNode = {...node, data: {...node.data, ...data}};

    if (nodeExists) {
      setNodes((nds) => nds.map((n) => (n.id === node.id ? updatedNode: n)))
    }else {
      addNodes(updatedNode)
    }

    setEditingNode(null);
  }


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
        onNodeClick={onNodeClick}
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Controls />
        <StartButton />
      </ReactFlow>

    <ConfigurationModal 
    node={editingNode}
    onSave={handleSave}
    onClose={handleCloseModal}
    />
    </div>
  );
}

export default FlowCanvas;
import { useState, useCallback, useRef, useEffect,  } from "react";
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
import { CircuitSchema } from "@/lib/schemas";      
import { toast } from "sonner";
import { ZodError } from "zod";
import { nodeDataFactory } from "@/lib/nodeFactory";


const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

const proOptions = { hideAttribution: true };
const defaultEdgeOptions = { 
  style: { strokeDasharray: '5.5' },
  type: 'smoothstep',
  animated: true,
  selectable: true,
};

const FlowCanvas: React.FC = () => {

  
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [editingNode, setEditingNode] = useState<AppNode | null>(null);

  const { screenToFlowPosition, getNodes, addNodes, getEdges } = useReactFlow();
  

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

      const createNodeData = nodeDataFactory[type];

      if(createNodeData) {
        const data = createNodeData(removeNode);
        
        const newNode = {
          id: getId(),
          type,
          position,
          data,
        };

        setEditingNode(newNode as AppNode);

      } else {
        console.warn(`[nodeFactory] Tipo de nó desconhecido: ${type}`)
      }
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

  const handleClickSimulate = () => {
    const allNodes = getNodes()
    const allEdges = getEdges();

    try {

      CircuitSchema.parse({ nodes: allNodes, edges: allEdges });

      console.log("Kratos", CircuitSchema)

      console.log("NODES E EDGES", nodes, edges)

      if(nodes.length === 0 || edges.length === 0){
        toast.error(`Circuito falhou na execução`)
        return;
      }

      toast.success("Circuito validado! Iniciando simulação...")

      //TODO CRIAR FUNÇÃO DE TRAÇAR CIRCUIT
      //traceCircuit(allNodes, allEdges);

    }catch(error) {
      console.error(`Erro ao iniciar simulação: ${error}`)

      if (error && typeof error === 'object' && 'issues' in error) {
        const zodError = error as ZodError;
        const errorMessage = zodError.issues[0].message;
        
        toast.error("Erro no Circuito ",{
           description: errorMessage });
        
      } else {
        toast.error("Ocorreu um erro desconhecido.");
      }
    }
  }

  return (
    <div className="w-full h-full " ref={reactFlowWrapper} >
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
        <StartButton
        onClick={handleClickSimulate}/>
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
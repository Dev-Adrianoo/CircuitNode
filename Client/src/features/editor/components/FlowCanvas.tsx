import { useState, useCallback, useRef } from "react";
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
} from "reactflow"
import type { AppNode, AnyComponentData, ArduinoState } from "@/core/types";
import { ConfigurationModal } from "@/features/editor/components/ConfigurationModal";
import { nodeTypes } from "@/features/editor/components/nodes/index";
import StartButton from "@/features/editor/components/StartWorkflowBtn";
import { CircuitSchema } from "@/core/schemas";
import { toast } from "sonner";
import { ZodError } from "zod";
import { nodeDataFactory } from "@/features/editor/lib/nodeFactory";
import { traceCircuit } from "@/core/simulation";
import { produce } from "immer";
import { runSimulationTick } from "@/simulation/engine";
import type { ArduinoData } from "@/core/types";


const initialArduinoState: ArduinoState = {
  pins: {
    'pin-13' : {mode : 'output', state: 'LOW'},
  },
}

const initialNodes: AppNode[] = [];
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

      if (createNodeData) {
        const data = createNodeData(removeNode);

        const newNode: AppNode = {
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
    if (editingNode) {
      const allNodes = getNodes()
      const nodeExists = allNodes.find((n) => n.id === editingNode.id);

      if (!nodeExists) {
        addNodes(editingNode)
      }
    }
    setEditingNode(null)
  }

  const handleSave = (node: AppNode, data: AnyComponentData) => {
    const allNodes = getNodes();
    const nodeExists = allNodes.find((n) => n.id === node.id)

    console.log("Salvando dados:", data);
    console.log("Dados existentes no nó:", node.data);

    const updatedNode = { ...node, data: { ...node.data, ...data } };

    console.log("Dados mesclados:", updatedNode.data);

    if (nodeExists) {
      setNodes((nds) => nds.map((n) => (n.id === node.id ? updatedNode : n)))
    } else {
      addNodes(updatedNode)
    }

    setEditingNode(null);
  }


  /**
   * Executa a validação e simulação do circuito ao clicar no botão.
   * 1. Valida a estrutura geral dos nós e arestas com Zod (CircuitSchema).
   * 2. Procura por arestas conectadas aos pinos digitais do Arduino, em qualquer direção.
   * 3. Para cada circuito encontrado, chama a função `traceCircuit` para traçar o caminho.
   * 4. Valida se o caminho traçado é um circuito completo, verificando se ele termina em um pino GND do Arduino.
   * 5. Exibe toasts de sucesso ou erro com base na validação do aterramento.
   */
  const handleClickSimulate = () => {
    const allNodes = getNodes()
    const allEdges = getEdges();


 
    console.log("--- INICIANDO SIMULAÇÃO ---");
    console.log("ESTADO ATUAL DOS NÓS:", JSON.stringify(allNodes, null, 2));
    console.log("ESTADO ATUAL DAS ARESTAS:", JSON.stringify(allEdges, null, 2));


    try {
      CircuitSchema.parse({ nodes: allNodes, edges: allEdges });

      if (allEdges.length === 0 || allNodes.length === 0) {
        toast.error(`Circuito falhou na execução está vázio!`)
        return;
      }

      const arduinoNode = allNodes.find(node => node.type === 'arduinoUno');

      if (!arduinoNode) {
        toast.error("Nenhuma placa Arduino encontrada no circuito.");
        return;
      }

      const digitalPinSourceHandles = Array.from({ length: 14 }, (_, i) => `d${i}_source`);
      const digitalPinTargetHandles = Array.from({ length: 14 }, (_, i) => `d${i}_target`);

      const connectedEdges = allEdges.filter(edge => 
        (edge.source === arduinoNode.id && digitalPinSourceHandles.includes(edge.sourceHandle || '')) ||
        (edge.target === arduinoNode.id && digitalPinTargetHandles.includes(edge.targetHandle || ''))
      );

      if (connectedEdges.length === 0) {
        toast.warning("Nenhum circuito encontrado a partir dos pinos digitais.")
        return;
      }

      let hasSuccessfulCircuit = false;

      connectedEdges.forEach(edge => {
        const isSource = edge.source === arduinoNode.id;
        const handleId = isSource ? edge.sourceHandle : edge.targetHandle;

        if (handleId) {
          const pinForToast = handleId.split('_')[0];
          const circuitPath = traceCircuit(allNodes, allEdges, arduinoNode.id, handleId);

          if (circuitPath.length > 0) { 
            const lastNodeInPath = circuitPath[circuitPath.length - 1];
            const finalEdge = allEdges.find(e => e.source === lastNodeInPath.id && e.target === arduinoNode.id);

            if (finalEdge) {
              const groundPins = ['gnd1', 'gnd2', 'gnd3'];
              if (groundPins.includes(finalEdge.targetHandle || '')) {
                const componentNames = [arduinoNode, ...circuitPath].map(node => node.data.label || node.type).join(' -> ');
                toast.success(`Circuito Aterrado: ${componentNames}`);
                hasSuccessfulCircuit = true;
              } else {
                toast.error(`Circuito do Pino ${pinForToast} não está aterrado corretamente (conectado em ${finalEdge.targetHandle}).`);
              }
            } else {
             
              if (lastNodeInPath.type === 'arduinoUno') {
                 const secondToLastNode = circuitPath[circuitPath.length - 2];
                 const edgeToGround = allEdges.find(e => e.source === secondToLastNode.id && e.target === lastNodeInPath.id);
                 const groundPins = ['gnd1', 'gnd2', 'gnd3'];
                 if(edgeToGround && groundPins.includes(edgeToGround.targetHandle || '')){
                    const componentNames = circuitPath.map(node => node.data.label || node.type).join(' -> ');
                    toast.success(`Circuito Aterrado: ${componentNames}`);
                    hasSuccessfulCircuit = true;
                 } else {
                    toast.error(`Circuito do Pino ${pinForToast} não está aterrado corretamente.`);
                 }
              } else {
                toast.error(`Circuito do Pino ${pinForToast} não retorna ao Arduino.`);
              }
            }
          } else {
            toast.warning(`Circuito do Pino ${pinForToast} está incompleto.`);
          }
        }
      })

      if (!hasSuccessfulCircuit) {
        toast.error("Nenhum circuito completo e aterrado foi encontrado.");
      }

    } catch (error) {
      console.error(`Erro ao iniciar simulação:`, error)

      if (error instanceof ZodError) {
        const errorMessage = error.issues.map(issue => `Campo '${issue.path.join('.')}': ${issue.message}`).join('; ');
        toast.error("Erro de Validação no Circuito", {
          description: errorMessage
        });
      } else {
        toast.error("Ocorreu um erro desconhecido durante a simulação.");
        console.error(error);
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
        <StartButton onClick={handleClickSimulate} />
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
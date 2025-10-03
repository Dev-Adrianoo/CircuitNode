import { useState, useCallback, useRef, useEffect } from "react";
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
} from "reactflow";
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
import { runSimulationTick, isLedNode } from "@/simulation/engine";
import customEdges from "@/ui/customEdges";
import CodeCard from "./CodeCard";
import { useDispatch } from 'react-redux';
import { setNodes as setReduxNodes, setEdges as setReduxEdges, setValidatedPinsMap } from '../editorSlice';

const edgeTypes = {
  customEdges: customEdges,
};

const initialArduinoState: ArduinoState = {
  pins: {},
};

function startSimulationLoop(
  validPins: string[],
  setArduinoState: React.Dispatch<React.SetStateAction<ArduinoState>>,
  simulationIntervalRef: React.MutableRefObject<NodeJS.Timeout | null>,
  setNodes: (updater: (nodes: AppNode[]) => AppNode[]) => void,
  getEdges: () => Edge[]
) {
  const simulationStartState = produce(initialArduinoState, (draft) => {
    for (const pin of validPins) {
      draft.pins[pin] = { mode: "output", state: "HIGH" };
    }
  });
  setArduinoState(simulationStartState);

  simulationIntervalRef.current = setInterval(() => {
    const tickTime = Date.now();
    setNodes((currentNodes) => {
      return runSimulationTick(
        currentNodes,
        getEdges(),
        simulationStartState,
        tickTime
      );
    });
  }, 250);
}

const initialNodes: AppNode[] = [];
const initialEdges: Edge[] = [];

const proOptions = { hideAttribution: true };
const defaultEdgeOptions = {
  type: "customEdges",
  animated: true,
  selectable: true,
};

const FlowCanvas: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const [isSimulating, setIsSimulating] = useState(false);
  const [, setArduinoState] = useState<ArduinoState>(initialArduinoState);
  const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isShowned, setIsShowned] =  useState(false);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    const serializableNodes = nodes.map(node => {
      const { removeNodeFunc, getNextHandle, ...restData } = node.data;
      return { ...node, data: restData };
    });
    dispatch(setReduxNodes(serializableNodes));
  }, [nodes, dispatch]);

  useEffect(() => {
    dispatch(setReduxEdges(edges));
  }, [edges, dispatch]);

  const [editingNode, setEditingNode] = useState<AppNode | null>(null);

  const { screenToFlowPosition, getNodes, addNodes, getEdges } = useReactFlow();

  const nodeIdCounter = useRef(0);
  const getId = useCallback(() => `dnd-node_${nodeIdCounter.current++}`, []);

  const onNodeClick = useCallback((_: React.MouseEvent, node: AppNode) => {
    setEditingNode(node);
  }, []);

  const removeNode = useCallback(
    (nodeIdToRemove: string) => {
      setNodes((currentNodes) =>
        currentNodes.filter((node) => node.id !== nodeIdToRemove)
      );
      setEdges((currentEdges) =>
        currentEdges.filter(
          (edge) =>
            edge.source !== nodeIdToRemove && edge.target !== nodeIdToRemove
        )
      );
    },
    [setNodes, setEdges]
  );

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow");

      if (typeof type === "undefined" || !type) {
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
        console.warn(`[nodeFactory] Tipo de nó desconhecido: ${type}`);
      }
    },
    [screenToFlowPosition, getId, removeNode]
  );
  
 
  const handleCloseModal = () => {
    if (editingNode) {
      const allNodes = getNodes();
      const nodeExists = allNodes.find((n) => n.id === editingNode.id);

      if (!nodeExists) {
        addNodes(editingNode);
      }
    }
    setEditingNode(null);
  };

  const handleSave = (node: AppNode, data: AnyComponentData) => {
    const allNodes = getNodes();
    const nodeExists = allNodes.find((n) => n.id === node.id);

    console.log("Salvando dados:", data);
    console.log("Dados existentes no nó:", node.data);

    const updatedNode = { ...node, data: { ...node.data, ...data } };

    console.log("Dados mesclados:", updatedNode.data);

    if (nodeExists) {
      setNodes((nds) => nds.map((n) => (n.id === node.id ? updatedNode : n)));
    } else {
      addNodes(updatedNode);
    }

    setEditingNode(null);
  };

  const handleClickSimulate = async () => {
    if (isSimulating) {
      clearInterval(simulationIntervalRef.current!);
      setIsSimulating(false);
      setArduinoState(initialArduinoState);
      setNodes((currentNodes) =>
        produce(currentNodes, (draft) => {
          draft.forEach((node) => {
            if (isLedNode(node)) {
              node.data.isOn = false;
              node.data.internalState = {};
            }
          });
        })
      );
      toast.info("Simulação parada.");
      setIsShowned(false);
      return;
    }

    try {
      const allNodes = getNodes();
      const allEdges = getEdges();

      console.log("--- INICIANDO SIMULAÇÃO ---");
      CircuitSchema.parse({ nodes: allNodes, edges: allEdges });

      if (allEdges.length === 0 || allNodes.length === 0) {
        toast.error(`Circuito está vazio!`);
        return;
      }

      const arduinoNode = allNodes.find((node) => node.type === "arduinoUno");
      if (!arduinoNode) {
        toast.error("Nenhuma placa Arduino encontrada no circuito.");
        return;
      }

      const connectedEdges = allEdges.filter(
        (edge) =>
          (edge.source === arduinoNode.id &&
            edge.sourceHandle?.startsWith("d")) ||
          (edge.target === arduinoNode.id && edge.targetHandle?.startsWith("d"))
      );

      if (connectedEdges.length === 0) {
        toast.warning(
          "Nenhum circuito encontrado a partir dos pinos digitais."
        );
        return;
      }

      const validPins: string[] = [];
      const newValidatedPinsMap = new Map<string, string>();

      connectedEdges.forEach((edge) => {
        const handleId =
          edge.source === arduinoNode.id
            ? edge.sourceHandle
            : edge.targetHandle;

        if (handleId && !validPins.some(pin => handleId.startsWith(pin))) {
          const pinForToast = handleId.split("_")[0];
          const circuitPath = traceCircuit(
            allNodes,
            allEdges,
            arduinoNode.id,
            handleId
          );

          if (circuitPath.length > 0) {
            const lastNodeInPath = circuitPath[circuitPath.length - 1];
            const finalEdge = allEdges.find(
              (e) =>
                ((e.source === lastNodeInPath.id &&
                  e.target === arduinoNode.id) ||
                  (e.target === lastNodeInPath.id &&
                    e.source === arduinoNode.id)) &&
                e.id !== edge.id
            );

            let isGrounded = false;
            const groundPins = ["gnd1", "gnd2", "gnd3"];

            if (finalEdge && lastNodeInPath.type !== "arduinoUno") {
                const arduinoHandle = finalEdge.source === arduinoNode.id ? finalEdge.sourceHandle : finalEdge.targetHandle;
                if (arduinoHandle && groundPins.some((gnd) => arduinoHandle.startsWith(gnd))) {
                    isGrounded = true;
                }
            } else if (lastNodeInPath.type === "arduinoUno" && circuitPath.length > 0) {
                // This case handles when the trace returns to the Arduino node itself.
                const returnEdge = allEdges.find(e => 
                    !e.id.includes(edge.id) &&
                    ((e.source === circuitPath[circuitPath.length - 2]?.id && e.target === lastNodeInPath.id) ||
                    (e.target === circuitPath[circuitPath.length - 2]?.id && e.source === lastNodeInPath.id))
                );
                const arduinoHandle = returnEdge?.target === arduinoNode.id ? returnEdge?.targetHandle : returnEdge?.sourceHandle;
                if (arduinoHandle && groundPins.some((gnd) => arduinoHandle.startsWith(gnd))) {
                    isGrounded = true;
                }
            }

            if(isGrounded) {
                toast.success(`Circuito do pino ${pinForToast} aterrado com sucesso.`);
                if (!validPins.includes(pinForToast)) validPins.push(pinForToast);
                for (const componentNode of circuitPath){
                    if(componentNode.type !== "arduinoUno") {
                        newValidatedPinsMap.set(componentNode.id, pinForToast);
                    }
                }
            } else {
                toast.error(`Circuito do Pino ${pinForToast} não está aterrado corretamente.`);
            }
          }
        }
      });
      
      if (validPins.length > 0) {
        dispatch(setValidatedPinsMap(Array.from(newValidatedPinsMap.entries())));
        setIsSimulating(true);
        toast.success(`Simulação iniciada para: ${validPins.join(", ")}`);
        startSimulationLoop(
          validPins,
          setArduinoState,
          simulationIntervalRef,
          setNodes,
          getEdges
        );
        setIsShowned(true); 
      } else {
        toast.error(
          "Nenhum circuito completo e aterrado foi encontrado para simular."
        );
      }
    } catch (error) {
      console.error(`Erro ao iniciar simulação:`, error);
      if (error instanceof ZodError) {
        const errorMessage = error.issues
          .map((issue) => `Campo '${issue.path.join(".")}': ${issue.message}`)
          .join("; ");
        toast.error("Erro de Validação no Circuito", {
          description: errorMessage,
        });
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Ocorreu um erro desconhecido durante a simulação.");
      }
    }
  };

  return (
    <div className="w-full h-full " ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onDragOver={onDragOver}
        onDrop={onDrop}
        defaultEdgeOptions={defaultEdgeOptions}
        proOptions={proOptions}
        className="bg-gray-800"
        onNodeClick={onNodeClick}
      >
        <Background variant={BackgroundVariant.Dots} gap={17} size={1} />

        <Controls className="!rounded-full !bg-black" />

        <CodeCard isOpen={isShowned} />

        <StartButton
          onClick={handleClickSimulate}
          isSimulating={isSimulating}
        />
      </ReactFlow>

      <ConfigurationModal
        node={editingNode}
        onSave={handleSave}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default FlowCanvas;

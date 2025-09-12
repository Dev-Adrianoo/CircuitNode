import { produce, type Draft } from 'immer';
import { type Node, type Edge } from 'reactflow';
import type { AppNode, ArduinoState, LedData } from '../core/types';
import { traceCircuit } from '../core/simulation';

// Type guard para ajudar o TypeScript a entender o tipo do nó.

/**
 * Executa um "tick" da simulação.
 * Calcula o estado de todos os componentes com base nas fontes de energia (pinos do Arduino).
 * retorna Um novo array de nós com os estados atualizados.
*/


export function isLedNode(node: AppNode): node is Draft<Node<LedData>> {
  return node.type === 'led';
  
}

export const runSimulationTick = (
  currentNodes: AppNode[],
  currentEdges: Edge[],
  currentArduinoState: ArduinoState
): AppNode[] => {

  const newNodes = produce(currentNodes, (draftNodes: Draft<AppNode[]>) => {

    draftNodes.forEach(node => {
      if (isLedNode(node)) {
        node.data.isOn = false;
      }
    });
    
    const arduinoNode = draftNodes.find((n) => n.type === 'arduinoUno');
    if (!arduinoNode) return;

    for (const pinId in currentArduinoState.pins) {
      const pin = currentArduinoState.pins[pinId];
      console.log(`[runSimulationTick] Processing pin: ${pinId}, Mode: ${pin.mode}, State: ${pin.state}`);

      if (pin.mode === 'output' && pin.state === 'HIGH') {
        console.log(`[runSimulationTick] Pin ${pinId} is HIGH and output.`);
        const connectedEdge = currentEdges.find(edge => 
            (edge.source === arduinoNode.id && edge.sourceHandle?.startsWith(pinId)) ||
            (edge.target === arduinoNode.id && edge.targetHandle?.startsWith(pinId))
        );

        if (!connectedEdge) {
          console.log(`[runSimulationTick] No connected edge found for pin ${pinId}.`);
          continue;
        }
        console.log(`[runSimulationTick] Connected edge found: ${connectedEdge.id}`);

        const handleId = connectedEdge.source === arduinoNode.id 
                         ? connectedEdge.sourceHandle! 
                         : connectedEdge.targetHandle!;
        console.log(`[runSimulationTick] Handle ID for tracing: ${handleId}`);
        
        const circuitPath = traceCircuit(draftNodes as AppNode[], currentEdges, arduinoNode.id, handleId);
        console.log(`[runSimulationTick] Circuit path length for ${pinId}: ${circuitPath.length}`);

        if (circuitPath.length > 0) {
          const lastComponentInPath = circuitPath[circuitPath.length - 2];
          const finalEdge = currentEdges.find(e =>
            ((e.source === lastComponentInPath.id && e.target === arduinoNode.id) ||
            (e.target === lastComponentInPath.id && e.source === arduinoNode.id)) && e.id !== connectedEdge.id
          );
          const arduinoHandle = finalEdge?.source === arduinoNode.id ? finalEdge.sourceHandle : finalEdge?.targetHandle;
          console.log(`[runSimulationTick] Final edge found: ${finalEdge?.id}, Arduino handle: ${arduinoHandle}`);
          
          if (arduinoHandle?.startsWith('gnd')) {
            console.log(`[runSimulationTick] Circuit for pin ${pinId} is grounded. Turning on LEDs in path.`);
            circuitPath.forEach((pathNode: Node) => {
              const nodeToUpdate = draftNodes.find((n) => n.id === pathNode.id);
              if (nodeToUpdate && isLedNode(nodeToUpdate)) {
                  nodeToUpdate.data.isOn = true;
                  console.log(`[runSimulationTick] LED ${nodeToUpdate.id} (Label: ${nodeToUpdate.data.label}) set to ON.`);
              }
            });
          } else {
            console.log(`[runSimulationTick] Circuit for pin ${pinId} is NOT grounded via expected handle.`);
          }
        }
      }
    }
  });

  return newNodes;
};
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


function isLedNode(node: Draft<AppNode>): node is Draft<Node<LedData>> {
  return node.type === 'led';
  
}

export const runSimulationTick = (
  currentNodes: AppNode[],
  currentEdges: Edge[],
  currentArduinoState: ArduinoState
): AppNode[] => {

  return produce(currentNodes, (draftNodes: Draft<AppNode[]>) => {

    draftNodes.forEach((node: Draft<AppNode>) => {
      if (isLedNode(node)) {
        node.data.isOn = false;
      }
    });

    const arduinoNode = draftNodes.find((n) => n.type === 'arduinoUno');
    if (!arduinoNode) return;

    for (const pinId in currentArduinoState.pins) {
      const pin = currentArduinoState.pins[pinId];

      if (pin.mode === 'output' && pin.state === 'HIGH') {
        const handleId = `${pinId}-source`;
        const circuitPath = traceCircuit(
          draftNodes as Node[],
          currentEdges,
          arduinoNode.id,
          handleId
        );

        if (circuitPath.length > 0) {
          const lastNodeInPath = circuitPath[circuitPath.length - 1];

          const finalEdge = currentEdges.find(
            (e) =>
              (e.source === lastNodeInPath.id && e.target === arduinoNode.id) ||
              (e.target === lastNodeInPath.id && e.source === arduinoNode.id)
          );

          const arduinoHandle =
            finalEdge?.source === arduinoNode.id
              ? finalEdge.sourceHandle
              : finalEdge?.targetHandle;

          if (arduinoHandle?.startsWith('gnd')) {
            circuitPath.forEach((pathNode: Node) => {
              const nodeInDraft = draftNodes.find((n) => n.id === pathNode.id);
              if (nodeInDraft && isLedNode(nodeInDraft)) {
                nodeInDraft.data.isOn = true;
              }
            });
          }
        }
      }
    }
  });
};
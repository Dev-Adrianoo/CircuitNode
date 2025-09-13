import { produce, type Draft } from 'immer';
import { type Node, type Edge } from 'reactflow';
import type { AppNode, ArduinoState, LedData } from '../core/types';
import { traceCircuit } from '../core/simulation';
import { behaviorStrategies } from './behaviors';

export function isLedNode(node: AppNode): node is Draft<Node<LedData>> {
  return node.type === 'led';
}

export const runSimulationTick = (
  currentNodes: AppNode[],
  currentEdges: Edge[],
  currentArduinoState: ArduinoState,
  currentTime: number
): AppNode[] => {

  const poweredNodeIds = new Set<string>();
  const arduinoNode = currentNodes.find((n) => n.type === 'arduinoUno');

  if (arduinoNode) {
    for (const pinId in currentArduinoState.pins) {
      const pin = currentArduinoState.pins[pinId];

      if (pin.mode === 'output' && pin.state === 'HIGH') {
        const startEdge = currentEdges.find(edge =>
            (edge.source === arduinoNode.id && edge.sourceHandle?.startsWith(pinId)) ||
            (edge.target === arduinoNode.id && edge.targetHandle?.startsWith(pinId))
        );

        if (!startEdge) continue;

        const handleId = startEdge.source === arduinoNode.id
                         ? startEdge.sourceHandle!
                         : startEdge.targetHandle!;

        const circuitPath = traceCircuit(currentNodes, currentEdges, arduinoNode.id, handleId);

        if (circuitPath.length > 0) {
          const lastNodeInPath = circuitPath[circuitPath.length - 1];
          
      
          if (lastNodeInPath.type === 'arduinoUno' && circuitPath.length > 1) {
            const secondToLastNode = circuitPath[circuitPath.length - 2];
            const edgeToGround = currentEdges.find(e =>
                ((e.source === secondToLastNode.id && e.target === lastNodeInPath.id) ||
                (e.target === secondToLastNode.id && e.source === lastNodeInPath.id)) &&
                e.id !== startEdge.id
            );
            
            if (edgeToGround) {
                const arduinoHandle = edgeToGround.source === lastNodeInPath.id ? edgeToGround.sourceHandle : edgeToGround.targetHandle;
                if (arduinoHandle?.startsWith('gnd')) {
            
                    circuitPath.slice(0, -1).forEach(node => poweredNodeIds.add(node.id));
                }
            }
          }
        }
      }
    }
  }

  const newNodes = produce(currentNodes, (draftNodes: Draft<AppNode[]>) => {
    draftNodes.forEach(node => {
      if (isLedNode(node)) {
        const strategy = behaviorStrategies[node.data.behavior.type];
        if (strategy) {
          const context = {
            isPowered: poweredNodeIds.has(node.id),
            currentTime: currentTime,
          };
          const updatedData = strategy.update(node.data, context);
          node.data = updatedData as Draft<LedData>;
        } else {
            node.data.isOn = false;
        }
      }
    });
  });

  return newNodes;
};
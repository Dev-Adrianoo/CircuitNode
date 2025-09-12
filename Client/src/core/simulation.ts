import { type Node, type Edge } from  'reactflow';

/**
 * Percorre o grafo do circuito a partir de um ponto de partida no Arduino.
 * A função é totalmente bidirecional em cada passo, não importando a direção de cada conexão.
 * Retorna um array ordenado de nós que formam o caminho.
 */

export function traceCircuit(
  nodes: Node[],
  edges: Edge[],
  startNodeId: string,
  startHandleId: string,
): Node[] {
  const circuitPath: Node[] = [];

  const firstEdge = edges.find(e =>
    (e.source === startNodeId && e.sourceHandle === startHandleId) ||
    (e.target === startNodeId && e.targetHandle === startHandleId)
  );

  if (!firstEdge) {
    return [];
  }

  const isStartNodeSource = firstEdge.source === startNodeId;
  let currentNodeId: string | null = isStartNodeSource ? firstEdge.target : firstEdge.source;
  let currentInHandleId: string | null = (isStartNodeSource ? firstEdge.targetHandle : firstEdge.sourceHandle) ?? null;

  const visitedEdges = new Set<string>([firstEdge.id]);
  const MAX_STEPS = nodes.length + edges.length;

  for(let i = 0; i < MAX_STEPS; i++) {
    if (!currentNodeId) break;

    const currentNode = nodes.find(node => node.id === currentNodeId);
    if (!currentNode) break;

    circuitPath.push(currentNode);

    const getNextHandle = currentNode.data.getNextHandle;
    if (typeof getNextHandle !== 'function') {
      break;
    }
    const currentOutHandleId = getNextHandle(currentInHandleId);

    const nextEdge = edges.find(e => 
        !visitedEdges.has(e.id) &&
        ((e.source === currentNodeId && e.sourceHandle === currentOutHandleId) || 
         (e.target === currentNodeId && e.targetHandle === currentOutHandleId))
    );

    if(!nextEdge) break;
    
    visitedEdges.add(nextEdge.id);
    const isCurrentNodeSource: boolean = nextEdge.source === currentNodeId;
    currentNodeId = isCurrentNodeSource ? nextEdge.target : nextEdge.source;
    currentInHandleId = (isCurrentNodeSource ? nextEdge.targetHandle : nextEdge.sourceHandle) ?? null;
  }

  return circuitPath;
}

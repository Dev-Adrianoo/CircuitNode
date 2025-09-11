import { type Node, type Edge } from  'reactflow';

/**
 * Percorre o grafo do circuito a partir de um ponto de partida no Arduino.
 * A função é bidirecional, não importando se o pino inicial é a fonte ou o alvo da primeira conexão.
 * Retorna um array ordenado de nós que formam o caminho, sem incluir o nó inicial do Arduino.
 *
 * @param nodes Array de todos os nós do canvas.
 * @param edges Array de todas as arestas do canvas.
 * @param startNodeId O ID do nó onde o circuito começa (o Arduino).
 * @param startHandleId O handle/pino específico onde o circuito começa (ex: "d13_source").
 * @returns Um array de nós em ordem de conexão.
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

  const isArduinoSource = firstEdge.source === startNodeId;
  let currentNodeId = isArduinoSource ? firstEdge.target : firstEdge.source;
  let currentInHandleId = isArduinoSource ? firstEdge.targetHandle : firstEdge.sourceHandle;

  const MAX_STEPS = nodes.length + 1; 

  for(let i = 0; i < MAX_STEPS; i++) {
    const currentNode = nodes.find(node => node.id === currentNodeId);
    if (!currentNode) break;

    circuitPath.push(currentNode);


    const getNextHandle = currentNode.data.getNextHandle;
    if (typeof getNextHandle !== 'function') {
      
      break;
    }
    const currentOutHandleId = getNextHandle(currentInHandleId);

    const nextEdge = edges.find(
      (edge) => edge.source === currentNodeId && edge.sourceHandle === currentOutHandleId
    );

    if(!nextEdge) break;
    

    currentNodeId = nextEdge.target;
    currentInHandleId = nextEdge.targetHandle;
  }

  return circuitPath;
}

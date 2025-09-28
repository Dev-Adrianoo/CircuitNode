import type { AppNode } from "@/core/types";
import type { Edge } from "reactflow";

interface CompilerPayloadBody{
  board:string;
  components:CompilerPayloadComponents[]
}
interface CompilerPayloadComponents {
  id: string,
  type: string,
  label: string,
  properties?: {
    pin?: string,
    delay?: string,
  }
}

export default function generateCompilerPayload(
  Nodes: AppNode[],
  Edges: Edge[],
  validatedPinsMap: Map<string, string>
  ): CompilerPayloadBody {
  // here contains the logic for the generatePayload
  /*const boardType =  boardNode?.boardType || null;*/
  const boardNode = Nodes.find((node) => node?.type?.includes("arduino"));
  const PinConnnected = new Map<string, Edge>();
  Edges.forEach((edge) => {
    const isConnectedToArduino =
      edge.source === boardNode?.id || edge.target === boardNode?.id;

    if (isConnectedToArduino) {
      const arduinoHandleId =
        edge.source === boardNode?.id ? edge.sourceHandle : edge.targetHandle;
      const arduinoId =
        edge.source === boardNode?.id ? edge.target : edge.source;
      if (arduinoHandleId && arduinoId) {
        PinConnnected.set(arduinoId, edge);
      }
    }
  });
  const bodyParsing = Nodes.filter(
    (node) => node?.type === "led")
  const bodyComponents = bodyParsing.map((node) => {

    const validPin = validatedPinsMap.get(node.id)
  
      const resolvedPin = validPin?.match(/\d+/)?.[0];
      
    const properties: CompilerPayloadComponents["properties"] = {};

    if (resolvedPin) {
      properties.pin = resolvedPin;
    }
    return {
      id: node.id,
      type: node.type || '',
      label: node.data.label || '',
      properties:properties
    }
  });
  const arduinoBoard= boardNode?.type === "arduinoUno" ? 'uno' : ''
  const generatedPayload = {
    board: arduinoBoard,
    components: bodyComponents,
  };
  return generatedPayload;
}

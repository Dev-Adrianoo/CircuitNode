import type { AppNode, LedData } from "@/core/types";
import type { Edge } from "reactflow";

interface CompilerPayloadBody {
  board: string;
  components: CompilerPayloadComponents[];
}

interface CompilerPayloadComponents {
  id: string;
  type: string;
  label: string;
  properties?: {
    pin?: string;
    mode?: 'direct' | 'pulse' | 'blink';
    delay?: number;
    duration?: number;
    frequency?: number;
  };
}

function isLedNode(node: AppNode): node is AppNode & { data: LedData } {
    return node.type === 'led';
}

export default function generateCompilerPayload(  
  Nodes: AppNode[],
  Edges: Edge[],
  validatedPinsMap: Map<string, string>
): CompilerPayloadBody {
  const boardNode = Nodes.find((node) => node?.type?.includes("arduino"));

  const bodyComponents = Nodes.filter(isLedNode).map((node) => {
    const validPin = validatedPinsMap.get(node.id);
    const resolvedPin = validPin?.match(/\d+/)?.[0];

    const properties: CompilerPayloadComponents["properties"] = {};

    if (resolvedPin) {
      properties.pin = resolvedPin;
    }

    
    if (node.data.behavior) {
        switch (node.data.behavior.type) {
            case 'direct':
                properties.mode = 'direct';
                break;
            case 'delay': 
                properties.mode = 'pulse';
                properties.delay = node.data.behavior.delay ?? 0;
                properties.duration = node.data.behavior.duration ?? 1000;
                break;
            case 'blink':
                properties.mode = 'blink';
                properties.frequency = node.data.behavior.frequency ?? 1;
                break;
        }
    }

    return {
      id: node.id,
      type: node.type || 'led',
      label: node.data.label || '',
      properties: properties,
    };
  });

  const arduinoBoard = boardNode?.type === "arduinoUno" ? 'uno' : '';
  const generatedPayload = {
    board: arduinoBoard,
    components: bodyComponents,
  };
  
  console.log("[generateCompilerPayload] Payload Gerado:", JSON.stringify(generatedPayload, null, 2));

  return generatedPayload;
}

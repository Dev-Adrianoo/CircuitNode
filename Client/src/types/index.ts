import type { Node, Edge } from 'reactflow'

export interface BaseNodeData {
  label: string
}

export interface ResistorData extends BaseNodeData {
  resistence: number
}

export interface LedData extends BaseNodeData {
  color: 'red' | 'green' | 'blue';
  fowardVoltage: number;  // EM VOLTS
  maxCurrent: number; // EM MILIAMPERED ( MA )
}

export interface PowerSourceData extends BaseNodeData {
  voltage: number; // EM VOLTS
}


export type AnyComponentData = ResistorData | LedData | PowerSourceData | BaseNodeData;


export type AppNode = Node<AnyComponentData>;

export type AppEdge = Edge
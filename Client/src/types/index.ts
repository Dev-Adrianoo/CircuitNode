import type { Node, Edge } from 'reactflow'

export interface BaseNodeData {
  label: string
  removeNodeFunc: (id: string) => void;
  getNextHandle?: (inHandle: string | null) => string;
}

export interface ResistorData extends BaseNodeData {
  resistance: number //em Ohms
}

export interface LedData extends BaseNodeData {
  color: string;
  forward_voltage_V: number;  // em Volts
  max_current_A: number;      // em Amperes (ex: 0.02 para 20mA)
  isOn?: boolean; 
}

export interface PowerSourceData extends BaseNodeData {
  voltage: number; // EM VOLTS
}

export interface ArduinoData extends BaseNodeData {
  // O Arduino não tem propriedades configuráveis, no momento.
}

export type AnyComponentData = ResistorData | LedData | ArduinoData;

export type AppNode = Node<AnyComponentData>;

export type AppEdge = Edge;
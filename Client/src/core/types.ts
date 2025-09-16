import type { Node, Edge } from 'reactflow'

declare global {
  interface Navigator{
    serial: Serial;
  }
  
export interface BaseNodeData {
  label: string
  removeNodeFunc: (id: string) => void;
  getNextHandle?: (inHandle: string | null) => string | null;
}

export interface ResistorData extends BaseNodeData {
  resistance: number //em Ohms
}

export interface LedData extends BaseNodeData {
  color: string;
  delay: number ;
  forward_voltage_V: number;  // em Volts
  max_current_A: number;      // em Amperes (ex: 0.02 para 20mA)
  behavior: {
    type: 'direct' | 'delay' | 'blink';
    delay?: number;
    duration?: number;
    frequency?: number;
  };
  internalState?: {
    lastStateChangeTime?: number;
    wasPowered?: boolean;
  }
  isOn?: boolean
  lastUpdate?: number;
  }

export interface BehaviorUpdateContext {
  isPowered: boolean;
  currentTime: number;
}

export interface TemporalBehavior {
  update(nodeData: LedData, context: BehaviorUpdateContext): LedData;
}

export interface PowerSourceData extends BaseNodeData {
  voltage: number; // EM VOLTS
}

export interface ArduinoData extends BaseNodeData {
  // O Arduino não tem propriedades configuráveis, no momento.
}

// Tipos para o estado da simulação do Arduino
export interface ArduinoPinState {
  mode: 'input' | 'output';
  state: 'HIGH' | 'LOW';
}

export interface ArduinoState {
  pins: { [key: string]: ArduinoPinState };
}

export interface Serial extends EventTarget{
    requestPort(options?: SerialPortRequestOptions): Promise<SerialPort>
    getPorts(): Promise<SerialPort[]>
 }
}
export interface SerialPortRequestOptions{
    filters?:{usbVendorId?: number;usbProductId: number }[]
}
export interface SerialPort extends EventTarget{
    readable: ReadableStream<Uint8Array>
    writable: ReadableStream<Uint8Array>
    open(options: {baudRate:  number}): Promise<void>
    close(): Promise<void>
}

export type AnyComponentData = ResistorData | LedData | ArduinoData;

export type AppNode = Node<AnyComponentData>;

export type AppEdge = Edge;
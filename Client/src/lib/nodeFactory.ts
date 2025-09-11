import  type { AnyComponentData } from "@/types";

export const nodeDataFactory: { [key: string]: (removeNodeFunc: (id: string) => void) => AnyComponentData }= { 

  'resistor': (removeNodeFunc) => ({
  label: 'Resistor',
  resistance: 1000,
  removeNodeFunc: removeNodeFunc,
  getNextHandle: (inHandle: string | null) => inHandle === 'a' ? 'b' : 'a',  
  }),

  'led': (removeNodeFunc) => ({
  label: 'LED',
  color: 'red',
  forward_voltage_V: 1.8,
  max_current_A: 0.02,
  removeNodeFunc: removeNodeFunc,
  getNextHandle: (inHandle: string | null) => inHandle === 'anode' ? 'cathode' : 'anode',
  }),

  'arduinoUno': (removeNodeFunc) => ({
  label: 'Arduino Uno',
  removeNodeFunc: removeNodeFunc,
  })
}



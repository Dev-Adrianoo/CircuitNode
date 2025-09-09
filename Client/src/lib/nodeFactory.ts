import  type { AnyComponentData } from "@/types";

export const nodeDataFactory: { [key: string]: (removeNodeFunc: (id: string) => void) => AnyComponentData }= { 

  'resistor': (removeNodeFunc) => ({
  label: 'Resistor',
  resistance: 1000,
  removeNodeFunc: removeNodeFunc,   
  }),

  'led': (removeNodeFunc) => ({
  label: 'LED',
  color: 'red',
  foward_voltage_V: 1.8,
  max_current_A: 0.02,
  removeNodeFunc: removeNodeFunc,
  }),

  'arduinoUno': (removeNodeFunc) => ({
  label: 'Arduino Uno',
  removeNodeFunc: removeNodeFunc,
  })
}



import type { AnyComponentData } from "@/core/types";

export const nodeDataFactory: { [key: string]: (removeNodeFunc: (id: string) => void) => AnyComponentData } = {

  'resistor': (removeNodeFunc) => ({
    label: 'Resistor',
    resistance: 1000,
    removeNodeFunc: removeNodeFunc,
    getNextHandle: (inHandle: string | null) => {
      if (inHandle?.startsWith('a')) return 'b_source';
      if (inHandle?.startsWith('b')) return 'a_source';
      return null;
    },
  }),

  'led': (removeNodeFunc) => ({
    label: 'LED',
    color: 'red',
    forward_voltage_V: 1.8,
    max_current_A: 0.02,
    removeNodeFunc: removeNodeFunc,
    behavior: { type: 'direct' },
    getNextHandle: (inHandle: string | null) => {
      if (inHandle === 'anode_target') return 'cathode_source';
      return null;
    },
  }),
  'servoMotor': (removeNodeFunc) =>({
     label: 'Servo Motor',
     rotationDegrees: 0,
     horn: "single",
     removeNodeFunc: removeNodeFunc,
  }),
  'arduinoUno': (removeNodeFunc) => ({
    label: 'Arduino Uno',
    removeNodeFunc: removeNodeFunc,
  })
}



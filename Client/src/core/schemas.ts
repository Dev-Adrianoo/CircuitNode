import { z } from "zod";

// validando posição do schema
const PositionSchema = z.object({
  x: z.number(),
  y: z.number(),
});

// validação para o resistor.
export const ResistorDataSchema = z.object({
  label: z.string().min(1, 'O label é obrigatório.'),
  resistance: z.number().positive('A resistência deve ser um número positivo.'),
  getNextHandle: z.function().optional(),
}).passthrough()


// validação para o led
export const LedDataSchema = z.object({
  label: z.string().min(1, 'O label é obrigatório.'),
  color: z.string().default('red'),
  forward_voltage_V: z.number().positive('A queda de tensão deve ser positiva.'),
  max_current_A: z.number().positive('A corrente máxima deve ser positiva.'),
  getNextHandle: z.function().optional(),
}).passthrough()

export const servoMotorSchema =  z.object({
  label: z.string().min(1, "O abel é obirgatório"),
  deg_rotation: z.number().positive("A angulo de rotação deve ser positivo"),
}).passthrough()
// validação para o Arduino Uno
export const ArduinoUnoDataSchema = z.object({
  label: z.string().min(1, 'O label é obrigatorio.'),
  getNextHandle: z.function().optional(),
}).passthrough()



const BaseNodeSchema = z.object({
  id: z.string(),
  position: PositionSchema,
  width: z.number().nullable().optional(),
  height: z.number().nullable().optional(),
}).passthrough(); 


export const NodeSchema = z.discriminatedUnion('type', [
  BaseNodeSchema.extend({ type: z.literal('resistor'), data: ResistorDataSchema }),
  BaseNodeSchema.extend({ type: z.literal('led'), data: LedDataSchema }),
  BaseNodeSchema.extend({ type: z.literal('arduinoUno'), data: ArduinoUnoDataSchema }),
  BaseNodeSchema.extend({type: z.literal('servoMotor'), data: servoMotorSchema}),
]);


// validação para nossas Arestas ( linhas )
export const EdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  sourceHandle: z.string().nullable(),
  targetHandle: z.string().nullable(),
});

export const CircuitSchema = z.object({
  nodes: z.array(NodeSchema),
  edges: z.array(EdgeSchema),
});
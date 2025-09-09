import { z } from "zod";


// validação para o resistor.
export const ResistorDataSchema = z.object ({
  label: z.string().min(1, 'O label é obrigatório.'),
  resistance: z.number().positive('A resistência deve ser um número positivo.'),
})



// validação para o led
export const LedDataSchema = z.object({
  label: z.string().min(1, 'O label é obrigatório.'),
  color: z.string().default('red'),
  forward_voltage_V: z.number().positive('A queda de tensão deve ser positiva.'),
  max_current_A: z.number().positive('A corrente máxima deve ser positiva.')
})

// validação para o Arduino Uno
export const ArduinoUnoDataSchema = z.object({
  label: z.string().min(1, 'O label é obrigatorio.'),
})


// validação para nossos nodes
export const NodeSchema = z.discriminatedUnion('type', [
  z.object({ id: z.string(), type: z.literal('resistor'), data: ResistorDataSchema, position: z.any(), width: z.any().optional, height: z.any().optional() }),
  z.object({ id: z.string(), type: z.literal('led'), data: LedDataSchema, position: z.any(), width: z.any().optional, height: z.any().optional() }),
  z.object({ id: z.string(), type: z.literal('arduinoUno'), data: ArduinoUnoDataSchema, position: z.any(), width: z.any().optional(), height: z.any().optional()  })
])


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


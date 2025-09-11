import  DefaultNode  from "./protoBoard";
import ArduinoUnoNode from "./arduinoUno";
import LedNode from "./led";
import ResistorNode from "./resistor";

export const nodeTypes = {
  start: DefaultNode,
  arduinoUno: ArduinoUnoNode,
  led: LedNode,
  resistor: ResistorNode,
};
import  DefaultNode  from "./default_node";
import ArduinoUnoNode from "./arduinoUno";
import LedNode from "./led_node";
import ResistorNode from "./resistor_node";

export const nodeTypes = {
  start: DefaultNode,
  arduinoUno: ArduinoUnoNode,
  led: LedNode,
  resistor: ResistorNode,
};
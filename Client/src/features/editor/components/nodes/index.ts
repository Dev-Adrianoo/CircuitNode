import  DefaultNode  from "./protoBoard";
import ArduinoUnoNode from "./arduinoUno";
import LedNode from "./led";
import ResistorNode from "./resistor";
import servoMotorNode from "./servoMotor";

export const nodeTypes = {
  start: DefaultNode,
  arduinoUno: ArduinoUnoNode,
  led: LedNode,
  resistor: ResistorNode,
  servoMotor: servoMotorNode,

};
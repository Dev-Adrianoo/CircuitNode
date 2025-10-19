import  DefaultNode  from "./protoBoard";
import ArduinoUnoNode from "./arduinoUno";
import LedNode from "./led";
import ResistorNode from "./resistor";
import servoMotorNode from "./servoMotor";
import ESP32Node from "./esp32";

export const nodeTypes = {
  start: DefaultNode,
  arduinoUno: ArduinoUnoNode,
  led: LedNode,
  resistor: ResistorNode,
  servoMotor: servoMotorNode,
  esp32: ESP32Node,
};
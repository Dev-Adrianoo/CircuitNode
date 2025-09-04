import  DefaultNode  from "./default_node";
import BoardNode from "./board_node";
import LedNode from "./led_node";
import ResistorNode from "./resistor_node";

export const nodeTypes = {
  start: DefaultNode,
  board: BoardNode,
  led: LedNode,
  resistor: ResistorNode,
};
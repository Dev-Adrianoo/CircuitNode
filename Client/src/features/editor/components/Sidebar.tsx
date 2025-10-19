import type React from "react";
import SearchBarLib from "./SearchBarLib";

export interface NodeLib {
  nodeType: string;
  label: string;
}
interface SideBarProps {
  isOpen: boolean;
}
const DraggableNode = ({ nodeType, label }: NodeLib) => {
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string
  ) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };
  return (
    <div

      className="p-3 border-1 border-gray-900 rounded-md text-center font-medium text-gray-900 bg-white hover:bg-gray-400 hover:text-white hover:border-gray-200 transition-colors  cursor-move shadow-md"


      onDragStart={(event) => onDragStart(event, nodeType)}
      draggable
    >
      {label}
    </div>
  );
};

export default function Sidebar({ isOpen }: SideBarProps) {
  return (
    <aside
      className={`z-50 h-full min-w-0  bg-gray-100 flex-col space-y-4 transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'w-64 p-4 border-l border-gray-700 shadow-md rounded-l-sm' : 'w-0 p-0 border-none'}`}>
      <h2 className="text-xl font-medium text-gray-900">Biblioteca</h2>
      <p className="text-sm text-gray-900">
        Arraste um nó para o canvas para começar
      </p>
      <SearchBarLib />
      <div className="flex flex-col space-y-3 p-4">
        <DraggableNode nodeType="arduinoUno" label="Arduino Uno" />
        <DraggableNode nodeType="resistor" label="Resistor" />
        <DraggableNode nodeType="led" label="LED" />
        <DraggableNode nodeType="servoMotor" label="Servo Motor" />
        <DraggableNode nodeType="esp32" label="Esp32" />
      </div>
    </aside>
  );
}

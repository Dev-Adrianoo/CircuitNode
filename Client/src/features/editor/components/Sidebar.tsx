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

      className="p-3 border-2 border-gray-300 rounded-md cursor-grab text-center font-medium text-gray-700  hover:bg-gray-200 hover:border-blue-300 transition-colors  cursor-move shadow-sm"


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
      className={`z-50 h-full min-w-0  bg-custom-whitesh flex-col space-y-4 transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'w-64 p-4 border-l border-gray-300' : 'w-0 p-0 border-none'}`}>
            <h2 className="text-xl font-medium text-gray-800">Biblioteca</h2>
      <p className="text-sm text-gray-500">
        Arraste um nó para o canvas para começar
      </p>
      <SearchBarLib />
      <div className="flex flex-col space-y-3 p-4">
        <DraggableNode nodeType="arduinoUno" label="Arduino Uno" />
        <DraggableNode nodeType="resistor" label="Resistor" />
        <DraggableNode nodeType="led" label="LED" />
      </div>
    </aside>
  );
}

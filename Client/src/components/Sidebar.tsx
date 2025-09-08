import type React from "react"
import SearchBarLib from "./SearchBarLib";


export interface NodeLib {

    nodeType: string,
    label:string
    
}
const DraggableNode = ({ nodeType, label }:  NodeLib) => {

  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  } 
  return (
    <div
    className="p-3 border-2 border-gray-300 rounded-md cursor-grab text-center font-semibold text-gray-700 hover: bg-teal-50 hover:border-teal-500 transition-colors shadow-sm"
    onDragStart={(event) => onDragStart(event, nodeType)}
    draggable
    >
    {label}
  </div>
  )
}

export default function Sidebar() {
  return (
    // criando componente da sidebar semelhante ao n8n.
    <aside className="w-64 p-4 border-l border-gray-300 bg-gray-100 flex flex-col space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Biblioteca</h2>
      <p className="text-sm text-gray-500">Arraste um nó para o canvas para começar</p>
      <SearchBarLib />
      <div className="flex flex-col space-y-3 p-4">
          <DraggableNode nodeType="arduinoUno" label="Arduino Uno" />
          <DraggableNode nodeType="resistor" label="Resistor" />
          <DraggableNode nodeType="led" label="LED" />
        
      </div>
      </aside>
  )
}
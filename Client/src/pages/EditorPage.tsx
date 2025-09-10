import { useState } from "react";
import FlowCanvas from "../components/flow/FlowCanvas";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { ReactFlowProvider } from "reactflow";

export default function EditorPage() {
  
  const [isOpen, setIsOpen] = useState(true);
  const HandleToggler = () =>{
      setIsOpen(!isOpen)
  }
  return (
    <div className="flex flex-col h-screen w-screen bg-gray-600 font-sans">
      <Header onToggle={HandleToggler}/>
      <div className="flex flex-grow flex-row-reverse overflow-hidden">
        <Sidebar isOpen={isOpen}/>
        <div className="flex-grow h-full">
          <ReactFlowProvider>
            <FlowCanvas />
          </ReactFlowProvider>
        </div>
      </div>
    </div>
  )
}
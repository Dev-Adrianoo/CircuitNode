import FlowCanvas from "../components/flow/FlowCanvas";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { ReactFlowProvider } from "reactflow";

export default function EditorPage() {

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-200 font-sans">
      <Header />
      <div className="flex flex-grow">
        <ReactFlowProvider>
          <Sidebar />
          <FlowCanvas />
        </ReactFlowProvider>
      </div>
    </div>
  )
}
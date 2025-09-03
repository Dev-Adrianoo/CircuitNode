import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Canvas from "../components/flow/FlowCanvas";

export default function CanvasPage() {
  return (
    <>
      <title>CircuitNode-Canvas</title>
      <div className="h-dvh flex flex-col">
        <Header />
        <div className="flex flex-1 overflow-hidden"> {/* Main content area */}
          <main className="flex-1 h-full"> {/* Canvas takes up remaining space */}
            <Canvas />
          </main>
          {/* Sidebar is now part of the flex layout, on the right */}
          <div className="w-64 h-full">
            <Sidebar />
          </div>
        </div>
      </div>
    </>
  )
}
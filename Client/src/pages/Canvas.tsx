import FlowRender from "../components/flow_components/flow_render";
import Header from "../components/Header";
import Sidebar from "../components/SIdebar";
import Canvas from "../components/canvas";

export default function CanvasPage () {
  return (
    // a parte de canvas do workflow.
    <>
    
     <title>CircuitNode-Canvas</title>
      <div className="flex-wrap h-dvh">
            <Header />
              <div className=" flex justify-self-center w-[60%] h-screen ">
                  <Canvas />
              </div>
              <div className="flex justify-end self-center  w-64 top-0 right-0 fixed"> 
                  <Sidebar />
              </div>  
          </div>
    </>
  )
}
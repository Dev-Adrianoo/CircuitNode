import { BoardNode, DefaultNode, LedNode, ResistorNode } from "./flow_components/nodes";

export default function Sidebar() {
  return (
    // criando componente da sidebar semelhante ao n8n.
    <>
      <div className="flex self-center justify-center bg-green-700 h-dvh w-3/5   md:w-6/12 lg:w-full text-left ">
        <h1 className="m-0 "> Side Bar</h1>
        <div className=" overflow-y-scroll  w-full jusfify-self-center self-center" >
           <p>Nodes</p>
        </div>
      </div>  
    </>
  )
}
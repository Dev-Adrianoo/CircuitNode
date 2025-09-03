import FlowRender from "../components/flow_components/flow_render";

export default function Canvas () {
  return (
    // a parte de canvas do workflow.
    <>
      <div className="flex justify-center">
       <FlowRender />
      </div>
    </>
  )
}
import { ArrowLeft, ArrowUp, RectangleCircle, RectangleEllipsis, Triangle } from "lucide-react";
import { BaseEdge, getSmoothStepPath } from "reactflow";
import { type EdgeProps } from "reactflow";
export default function customEdges({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  sourceHandleId,
  targetHandleId,
  animated,
}: EdgeProps) {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,

  });
  let customStyle = "";
  let customAnimationTimer=  "";
  
  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{ stroke: "gray", strokeWidth: 2 }}
      />
      {animated && (
        <g>
           <circle fill="gray" cx={0} cy={0} r={3}>
=          <animateMotion
            dur="4s"
            repeatCount="indefinite"
            path={edgePath}
            rotate="auto"
            calcMode="spline"
            keySplines='0.4 0 0.2 1'

          />
          </circle>
        </g>
      )}
    </>
  );
}

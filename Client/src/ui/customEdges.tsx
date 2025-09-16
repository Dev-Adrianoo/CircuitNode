import { JUMPERS_COLOR_MAP } from "@/features/editor/lib/electronicsUtils";
import type React from "react";
import { BaseEdge, getSmoothStepPath } from "reactflow";
import { type EdgeProps } from "reactflow";

type EdgeStyle = React.CSSProperties;
type jumperColorsMap = { [key: string ]: string };
interface CircleComponentProps{
     style: EdgeStyle;
}
const circlePath : React.FC<CircleComponentProps> = ({ style }: { style: EdgeStyle }) => (
  <circle
    cx={0}
    cy={0}
    r={4}
    stroke={style.stroke as string}
    strokeWidth={Number(style.strokeWidth)}
    strokeDasharray= "none"
    fill={style.stroke as string}
  ></circle>
);

const colorMap = new Map<string, string>();
const jumperColors: jumperColorsMap = JUMPERS_COLOR_MAP;
const colorKeys = Object.keys(jumperColors);
const totalJumperColors = colorKeys.length;
function randomColors():string {
  const index =  Math.floor(Math.random() * totalJumperColors)
  return colorKeys[index]
}
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
  style,
}: EdgeProps) {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });
  const customStyle: EdgeStyle = {
    stroke: 'gray',
    strokeWidth: 2.5,
    ...style,
  };
  const handlekey = sourceHandleId || 'default'
  let handleColor:string
  if(colorMap.has(handlekey)){
    handleColor =  colorMap.get(handlekey)!
  }else{
     const randomKey = randomColors()  ;
     handleColor =  jumperColors[randomKey] || '#1d1f24'
     colorMap.set(handlekey, handleColor)
   }
  const CircleComponent: React.FC<CircleComponentProps> =  circlePath
  customStyle.stroke =  handleColor;
  console.log(sourceHandleId, targetHandleId);
  if (
    sourceHandleId === "gnd1" ||
    sourceHandleId === "gnd2" ||
    targetHandleId === "gnd1" ||
    targetHandleId === "gnd2"
  ) {
    customStyle.stroke = "#40403f";
  } else if (
    sourceHandleId === "cathode_source" ||
    targetHandleId === "cathode_target"
  ) {
    customStyle.stroke = "#40403f";
  } else if (
    sourceHandleId === "anode_source" ||
    targetHandleId === "anode_target"
  ) {
    customStyle.stroke = "#cc0b04";
  }
  return (
    <>
      <BaseEdge id={id} path={edgePath} style={customStyle} />
      {animated && (
        <g>
          <CircleComponent style={customStyle} />

          <animateMotion
            dur="4s"
            repeatCount="indefinite"
            path={edgePath}
            rotate="auto"
            calcMode="spline"
            keySplines="0.4 0 0.2 1"
          />
        </g>
      )}
    </>
  );
}

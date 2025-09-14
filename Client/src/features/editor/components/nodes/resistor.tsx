import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { getResistorColorBands } from "@/features/editor/lib/electronicsUtils";

const ResistorNode = ({ id, data }: NodeProps) => {
  const resistanceValue = Number(data.resistance) || 0;
  const colorBands = getResistorColorBands(resistanceValue);

  const onNodeRemove = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (data.removeNodeFunc) {
      data.removeNodeFunc(id);
    }
  };

  return (
    <div className="relative flex items-center justify-center box-shadow-custom-resistor  w-30  h-10 group">
      <div className="w-6 h-14  translate-z-32 rounded-md shadow-custom-l-resistor bg-custom-amber shadow-custom-l-resistor" />

      <div className="relative flex items-center gap-1.5 px-2 h-11 w-24 bg-custom-amber  shadow-custom-b-resistor ">
        <div className="absolute flex items-center right-0 justify-center gap-1 w-full h-3/5   ">
          <div className="font-semibold  -mt-0.5 text-[13px] text-gray-200 ">
            {data.label || "Resistor"}
          </div>

          {colorBands.map((color, index) => (
            <div
              key={index}
              className="w-4 h-10 mr-0.5"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div className="w-6 h-14 shadow-custom-l-resistor  bg-custom-amber rounded-md " />

      <div className="absolute inset-0">
        <>
          <Handle
            type="source"
            position={Position.Left}
            id="a_source"
            className="!w-4 !h-4 !bg-transparent !border-white"
            style={{ zIndex: 2 }}
          />
          <Handle
            type="target"
            position={Position.Left}
            id="a_target"
            className="!w-4 !h-4 !bg-black  !border-none"
            style={{ zIndex: 1 }}
          />
        </>
        <>
          <Handle
            type="source"
            position={Position.Right}
            id="b_source"
            className="!w-4 !h-4 !bg-transparent !border-white "
            style={{ zIndex: 2 }}
          />
          <Handle
            type="target"
            position={Position.Right}
            id="b_target"
            className="!w-4 !h-4 !bg-black !border-none"
            style={{ zIndex: 1 }}
          />
        </>

        <button
          onClick={onNodeRemove}
          className="absolute -top-4.5 -right-2 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-800  border-gray-400 transition-colors text-sm font-mono cursor-pointer opacity-0 group-hover:opacity-100"
          aria-label="Remover nó"
        >
          X
        </button>

        <div className="absolute -bottom-5 w-full text-center text-xs font-mono text-white opacity-0 group-hover:opacity-100">
          {resistanceValue}Ω
        </div>
      </div>
    </div>
  );
};
export default memo(ResistorNode);

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

    <div className="relative flex items-center justify-center w-auto h-12 group">
      

      <div className="w-0 h-0 border-y-[24px] border-y-transparent border-r-[16px] border-r-amber-500" />


      <div className="relative flex items-center justify-center gap-1.5 px-2 h-full w-24 bg-amber-500">

        <div className="absolute flex items-center justify-center gap-1 w-full h-3/5 bg-amber-100 rounded-sm border-t border-b border-amber-600">

        <div className="font-semibold text-sm text-black -mt-1">
         {data.label || 'Resistor'} 
        </div>
       
          {colorBands.map((color, index) => (
            <div
              key={index}
              className="w-2 h-full"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div className="w-0 h-0 border-y-[24px] border-y-transparent border-l-[16px] border-l-amber-500" />
      

      <div className="absolute inset-0">
        <>
          <Handle type="source" position={Position.Left} id="a_source" className="!w-4 !h-4 !bg-transparent !border-white" style={{ zIndex: 2 }} />
          <Handle type="target" position={Position.Left} id="a_target" className="!w-4 !h-4 !bg-black  !border-none" style={{ zIndex: 1 }} />
        </>
        <>
          <Handle type="source" position={Position.Right} id="b_source" className="!w-4 !h-4 !bg-transparent !border-white " style={{ zIndex: 2 }} />
          <Handle type="target" position={Position.Right} id="b_target" className="!w-4 !h-4 !bg-black !border-none" style={{ zIndex: 1 }} />
        </>
        
        <button
          onClick={onNodeRemove}
          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors text-sm font-mono cursor-pointer opacity-0 group-hover:opacity-100"
          aria-label="Remover nó"
        >
          X
        </button>

        <div className="absolute -bottom-5 w-full text-center text-xs font-mono text-black opacity-0 group-hover:opacity-100">
          {resistanceValue}Ω
        </div>
      </div>
    </div>
  );
};

export default memo(ResistorNode);
import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { LED_COLOR_MAP } from "@/lib/electronicsUtils";

const LedNode = ({ id, data }: NodeProps) => {
  const onNodeRemove = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (data.removeNodeFunc) {
      data.removeNodeFunc(id);
    }
  };

  const isLedOn = data.isOn || false;
  const colorKey = data.color || 'red';
  const colors = LED_COLOR_MAP[colorKey] || LED_COLOR_MAP.red;

  const ledBodyStyle = {
    background: `linear-gradient(to top, ${isLedOn ? colors.on : colors.off}, ${isLedOn ? colors.gradientFrom : colors.off})`,
    boxShadow: isLedOn ? colors.shadow : 'none',
    transition: 'background 0.3s ease, box-shadow 0.3s ease',
  };
  
  const glossStyle = {
    background: 'linear-gradient(to bottom, rgba(255,255,255,0.6), rgba(255,255,255,0.1))',
  };

  return (
    <div className="relative w-24 h-auto flex flex-col items-center group">
      
  
      <div 
        style={ledBodyStyle}
        className="relative w-16 h-16 rounded-t-full rounded-b-md border-2 border-black/20 flex items-center justify-center overflow-hidden z-10"
      >
        <div style={glossStyle} className="absolute top-1 w-8 h-4 rounded-full opacity-70" />
        <div className="font-bold text-white text-lg z-10 text-center leading-tight drop-shadow-md">
          {data.label || 'LED'}
        </div>
      </div>
      
    
      <div className="flex justify-between w-12 -mt-1">
        
        <div className="flex flex-col items-center">
          
          <div className="relative w-[9px] h-12 bg-slate-400">
           
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
              <>
                <Handle type="source" position={Position.Bottom} id="cathode" className="!w-4 !h-4 !bg-transparent !border-black" style={{ zIndex: 2 }} />
                <Handle type="target" position={Position.Bottom} id="cathode" className="!w-4 !h-4 !bg-black !border-none" style={{ zIndex: 1 }} />
              </>
            </div>
          <p className="font-bold text-lg text-gray-900 mt-1">-</p>
          </div>
        </div>

        
        <div className="flex flex-col items-center">
          
          <div className="relative w-3 h-16 bg-slate-400">
            
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
              <>
                <Handle type="source" position={Position.Bottom} id="anode" className="!w-4 !h-4 !bg-transparent !border-black" style={{ zIndex: 2 }} />
                <Handle type="target" position={Position.Bottom} id="anode" className="!w-4 !h-4 !bg-black !border-none" style={{ zIndex: 1 }}/>
              </>
            </div>
          <p className="font-bold text-lg text-gray-900 mt-1">+</p>
          </div>
        </div>
      </div>
      
     
      <div className="absolute -top-1 right-2 w-auto h-auto pointer-events-none">
        <button
          onClick={onNodeRemove}
          className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors text-sm font-mono cursor-pointer opacity-0 group-hover:opacity-100 z-20 pointer-events-auto"
          aria-label="Remover nó"
        >X</button>
      </div>
      <div className="absolute -bottom-5 w-full text-center text-xs font-mono text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
        {data.forward_voltage_V}V @ {data.max_current_A * 1000}mA
      </div>
    </div>
  );
};

export default memo(LedNode);
import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"

const GPIO_PINS = {
  left: [
    { id: "gpio36", label: "GPIO36", position: 10 },
    { id: "gpio39", label: "GPIO39", position: 20 },
    { id: "gpio34", label: "GPIO34", position: 30 },
    { id: "gpio35", label: "GPIO35", position: 40 },
    { id: "gpio32", label: "GPIO32", position: 50 },
    { id: "gpio33", label: "GPIO33", position: 60 },
    { id: "gpio25", label: "GPIO25", position: 70 },
    { id: "gpio26", label: "GPIO26", position: 80 },
    { id: "gpio27", label: "GPIO27", position: 90 },
  ],
  right: [
    { id: "gpio23", label: "GPIO23", position: 10 },
    { id: "gpio22", label: "GPIO22", position: 20 },
    { id: "gpio21", label: "GPIO21", position: 30 },
    { id: "gpio19", label: "GPIO19", position: 40 },
    { id: "gpio18", label: "GPIO18", position: 50 },
    { id: "gpio5", label: "GPIO5", position: 60 },
    { id: "gpio17", label: "GPIO17", position: 70 },
    { id: "gpio16", label: "GPIO16", position: 80 },
    { id: "gpio4", label: "GPIO4", position: 90 },
  ],
  top: [
    { id: "3v3", label: "3V3", position: 25 },
    { id: "gnd-1", label: "GND", position: 50 },
    { id: "vin", label: "VIN", position: 75 },
  ],
  bottom: [
    { id: "gpio2", label: "GPIO2", position: 33 },
    { id: "gpio15", label: "GPIO15", position: 66 },
  ],
}

const esp32Node = ({ id, data, selected }: NodeProps) => {
  const onNodeRemove = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (data.removeNodeFunc) {
      data.removeNodeFunc(id);
    }
  };

  return (
    <div
      className={`relative group bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-2xl transition-all duration-200 ${
        selected ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-950" : ""
      }`}
      style={{ width: 280, height: 400 }}
    >
      <button
        onClick={onNodeRemove}
        className="z-10 absolute top-0 right-0 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center -mt-2 -mr-2 hover:bg-red-800 text-sm font-mono cursor-pointer opacity-0 group-hover:opacity-100"
        aria-label="Remover nó"
      >
        X
      </button>

      {GPIO_PINS.top.map((pin) => (
        <div
          key={pin.id}
          className="absolute w-3 h-3 bg-amber-400 border-2 border-amber-600 rounded-full hover:bg-amber-300 transition-colors cursor-pointer -top-1.5"
          style={{ left: `${pin.position}%`, transform: "translateX(-50%)" }}
          title={pin.label}
        >
          <Handle
            type="source"
            position={Position.Top}
            id={`${pin.id}_source`}
            className="!w-full !h-full !bg-transparent !border-none"
            style={{ zIndex: 2 }}
          />
          <Handle
            type="target"
            position={Position.Top}
            id={`${pin.id}_target`}
            className="!w-full !h-full !bg-transparent !border-none"
            style={{ zIndex: 1 }}
          />
        </div>
      ))}


      {GPIO_PINS.left.map((pin) => (
        <div
          key={pin.id}
          className="absolute w-3 h-3 bg-emerald-400 border-2 border-emerald-600 rounded-full hover:bg-emerald-300 transition-colors cursor-pointer -left-1.5"
          style={{ top: `${pin.position}%`, transform: "translateY(-50%)" }}
          title={pin.label}
        >
          <Handle
            type="source"
            position={Position.Left}
            id={`${pin.id}_source`}
            className="!w-full !h-full !bg-transparent !border-none"
            style={{ zIndex: 2 }}
          />
          <Handle
            type="target"
            position={Position.Left}
            id={`${pin.id}_target`}
            className="!w-full !h-full !bg-transparent !border-none"
            style={{ zIndex: 1 }}
          />
        </div>
      ))}

      
      {GPIO_PINS.right.map((pin) => (
        <div
          key={pin.id}
          className="absolute w-3 h-3 bg-emerald-400 border-2 border-emerald-600 rounded-full hover:bg-emerald-300 transition-colors cursor-pointer -right-1.5"
          style={{ top: `${pin.position}%`, transform: "translateY(-50%)" }}
          title={pin.label}
        >
          <Handle
            type="source"
            position={Position.Right}
            id={`${pin.id}_source`}
            className="!w-full !h-full !bg-transparent !border-none"
            style={{ zIndex: 2 }}
          />
          <Handle
            type="target"
            position={Position.Right}
            id={`${pin.id}_target`}
            className="!w-full !h-full !bg-transparent !border-none"
            style={{ zIndex: 1 }}
          />
        </div>
      ))}

      
      {GPIO_PINS.bottom.map((pin) => (
        <div
          key={pin.id}
          className="absolute w-3 h-3 bg-amber-400 border-2 border-amber-600 rounded-full hover:bg-amber-300 transition-colors cursor-pointer -bottom-1.5"
          style={{ left: `${pin.position}%`, transform: "translateX(-50%)" }}
          title={pin.label}
        >
          <Handle
            type="source"
            position={Position.Bottom}
            id={`${pin.id}_source`}
            className="!w-full !h-full !bg-transparent !border-none"
            style={{ zIndex: 2 }}
          />
          <Handle
            type="target"
            position={Position.Bottom}
            id={`${pin.id}_target`}
            className="!w-full !h-full !bg-transparent !border-none"
            style={{ zIndex: 1 }}
          />
        </div>
      ))}

      
      <div className="relative h-full p-4 flex flex-col items-center justify-between">
        
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
              />
            </svg>
          </div>
          <h3 className="text-white font-bold text-lg">ESP32</h3>
        </div>

       
        <div className="flex-1 w-full flex items-center justify-center">
          <div className="relative w-full h-full max-w-[200px] max-h-[280px]">
           
            <div className="absolute inset-0 bg-gradient-to-br from-green-700 to-green-800 rounded-md shadow-inner border-2 border-green-900">
              
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-slate-900 rounded border border-slate-700 flex items-center justify-center">
                <div className="text-xs text-white font-mono text-center leading-tight">
                  ESP32
                  <br />
                  WROOM
                </div>
              </div>

              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-4 bg-slate-300 rounded-sm border border-slate-400" />

              <div className="absolute bottom-4 left-4 w-6 h-6 bg-red-500 rounded-full border-2 border-red-700 shadow-md" />

              <div className="absolute bottom-4 right-4 w-6 h-6 bg-blue-500 rounded-full border-2 border-blue-700 shadow-md" />

              <div className="absolute left-1 top-8 bottom-8 w-2 flex flex-col justify-between">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={`left-${i}`} className="w-2 h-2 bg-amber-400 rounded-full border border-amber-600" />
                ))}
              </div>

              <div className="absolute right-1 top-8 bottom-8 w-2 flex flex-col justify-between">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={`right-${i}`} className="w-2 h-2 bg-amber-400 rounded-full border border-amber-600" />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-400 text-center mt-2">
          <div className="font-mono">DevKitC V4</div>
          <div className="text-[10px] text-slate-500">Wi-Fi + Bluetooth</div>
        </div>
      </div>

      {GPIO_PINS.left.map((pin) => (
        <div
          key={`label-${pin.id}`}
          className="absolute -left-16 text-[10px] text-slate-400 font-mono whitespace-nowrap"
          style={{ top: `${pin.position}%`, transform: "translateY(-50%)" }}
        >
          {pin.label}
        </div>
      ))}

      {GPIO_PINS.right.map((pin) => (
        <div
          key={`label-${pin.id}`}
          className="absolute -right-16 text-[10px] text-slate-400 font-mono whitespace-nowrap"
          style={{ top: `${pin.position}%`, transform: "translateY(-50%)" }}
        >
          {pin.label}
        </div>
      ))}

      {GPIO_PINS.top.map((pin) => (
        <div
          key={`label-${pin.id}`}
          className="absolute -top-6 text-[10px] text-slate-400 font-mono whitespace-nowrap"
          style={{ left: `${pin.position}%`, transform: "translateX(-50%)" }}
        >
          {pin.label}
        </div>
      ))}

      {GPIO_PINS.bottom.map((pin) => (
        <div
          key={`label-${pin.id}`}
          className="absolute -bottom-6 text-[10px] text-slate-400 font-mono whitespace-nowrap"
          style={{ left: `${pin.position}%`, transform: "translateX(-50%)" }}
        >
          {pin.label}
        </div>
      ))}
    </div>
  );
};


export default memo(esp32Node);
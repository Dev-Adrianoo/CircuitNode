import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";

const servoMotorNode = ({ id, data }: NodeProps) => {
  const onNodeRemove = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (data.removeNodeFunc) {
      data.removeNodeFunc(id);
    }
  };
  const{rotationDegrees= data, isOn= true} = data;
  const rotationDeg=  rotationDegrees;
  const isServoOn = isOn;
 
  return (
    <div className="relative w-40  h-25 flex-col items-center group ">
      <div className= "bg-blue-800 h-full rounded-lg text-sm shadow-blue-950">
        <div className=" absolute left-0 right-0 top-0 text-center font-bold">
          {data.label || "Servo Motor"}
        </div>
        <div className="flex  absolute top-[30%] border-2 border-dotted border-gray-500 justify-center items-center rounded-full right-1 h-10 w-10 bg-white">
          <div className=" absolute z-20 h-1.5 w-1.5 border  border-dotted bg-gray-600 rounded-full"/>
          
          {/*Servo motor blade*/}
          <div className={`w-2 h-23 z-10  rounded-4xl bg-gray-200 ${isServoOn ? "" : ""}`}
          style={{transform: `rotate(${rotationDeg}deg)`}}
          />
          
        </div>
        <>
          <Handle
            type="source"
            position={Position.Left}
            id="sig_source"
            className="!w-3 !h-3 !bg-transparent !border-white "
            style={{ zIndex: 2, top: "45%" }}
          />
          <Handle
            type="target"
            position={Position.Left}
            id="sig_target"
            className="!w-3 !h-3 !bg-black !border-none"
            style={{ zIndex: 1 , top: "45%"}}
          />
          <span className="absolute  text-[8px] top-[40%] text-center left-3  text-gray-200"
         
          >
            SIG
          </span>
          <Handle
            type="source"
            position={Position.Left}
            id="vcc_source"
            className="!w-3 !h-3  !bg-transparent !border-white"
            style={{ zIndex: 2, top: "65%" }}
          />
          <Handle
            type="target"
            position={Position.Left}
            id="vcc_target"
            className="!w-3 !h-3 !bg-black !border-none"
            style={{ zIndex: 1, top: "65%" }}
          />
           <span className="absolute  text-[8px] text-center left-3 top-[60%] text-gray-200">
            VCC
          </span>
          <Handle
            type="source"
            position={Position.Left}
            id="gnd_servo_source"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
            className="!w-3 !h-3 !bg-transparent !border-white "
            style={{ zIndex: 2 , top: "85%" }}
          />
          <Handle
            type="target"
            position={Position.Left}
            id="gnd_servo_target"
            className="!w-3 !h-3 !bg-black !border-none"
            style={{ zIndex: 1 , top: "85%"}}
          />
           <span className="absolute  text-[8px] text-center left-3 top-[80%] text-gray-200">
            GND
           </span>
          <Handle
            type="source"
            position={Position.Bottom}
            id="recptor_source"
            className="!w-3 !h-3 !bg-transparent !border-white "
            style={{ zIndex: 2 , left: "75%"}}
          />
          <Handle
            type="target"
            position={Position.Bottom}
            id="recptor_target"
            className="!w-3 !h-3 !bg-black !border-none"
            style={{ zIndex: 1, left: "75%" }}
          />
        </>
        <button
          onClick={onNodeRemove}
          className="absolute -top-4.5 -right-2 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-800  border-gray-400 transition-colors text-sm font-mono cursor-pointer opacity-0 group-hover:opacity-100"
          aria-label="Remover nó"
        >
          X
        </button>
      </div>
    </div>
  );
};
export default memo(servoMotorNode);

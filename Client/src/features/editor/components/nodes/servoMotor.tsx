import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";

const servoMotorNode = ({ id, data }: NodeProps) => {
  const onNodeRemove = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (data.removeNodeFunc) {
      data.removeNodeFunc(id);
    }
  };
  const { rotationDegrees = data, horn = "single", isOn = true } = data;
  const rotationDeg = rotationDegrees;
  const hornCount = horn;
  const isServoOn = isOn;
  const sumRotation= rotationDeg + 90;
  return (
    <div className="relative w-22  h-35  flex-col items-center group ">
      <div className="absolute -top-6.5 border-b-1 border-b-gray-400 bg-black opacity-55 w-22 h-7 text-none">
        <div className="h-5 w-5 rounded-full justify-self-center  bg-gray-800" />
      </div>

      <div className="absolute bg-black opacity-55 w-22 h-7  border-t-1 border-t-gray-400 -bottom-6.5 text-none">
        <div className="absolute bottom-0 h-5 w-5 rounded-full justify-self-center  bg-gray-800" />
      </div>

      <div className=" bg-gray-900 h-full   text-sm  shadow-blue-950">
        <div className=" absolute bottom-2 left-0 right-0  text-center font-bold">
          {data.label || "Servo Motor"}
        </div>
        <div className="flex top-3 absolute border-2  border-dotted border-gray-500 justify-center items-center rounded-full right-5 h-12 w-12 bg-gray-200">
          
          <div className=" absolute text-black text-xs flex justify-center items-center z-20 h-3 w-3 border-3 border-gray-700 p-1 bg-gray-500 rounded-full">
            +
          </div>
          {/*Servo motor blade*/}
          {hornCount === "single" && (
            <>
              <div
                className={` absolute right-3 origin-bottom bottom-1/2  w-5 h-12.5 z-10  rounded-full mt-10 bg-gray-400 ${
                  isServoOn ? "" : ""
                }`}
                style={{ transform: `rotate(${rotationDeg}deg)` }}
              >
                <div className="bg-gray-600 h-2 w-2 rounded-full justify-self-center absolute top-1"/>
                <div className="bg-gray-600 h-2 w-2 rounded-full justify-self-center absolute top-4"/>
                <div className="bg-gray-600 h-2 w-2 rounded-full justify-self-center absolute top-7"/>
              </div>
            </>
          )}
          {hornCount === "double" && (
            <>
              <div
                className={`w-5 h-25 z-10 rounded-4xl bg-gray-400 ${
                  isServoOn ? "" : ""
                }`}
                style={{ transform: `rotate(${rotationDeg}deg)` }}
              />
              <div
                className={`absolute w-5 h-13.5 z-10 rounded-4xl bg-gray-400 ${
                  isServoOn ? "" : ""
                }`}
                style={{ transform: `rotate(${sumRotation}deg)` }}
              />
            </>
          )}
          <div className="absolute top-10   rounded-full h-10 w-10 bg-gray-200 opacity-80"/>
        </div>
        <div className="absolute h-10 w-10 -left-15 bottom-0 bg-custom-gray">
          <>
            <Handle
              type="source"
              position={Position.Left}
              id="sig_source"
              className="!w-3 !h-3 !bg-transparent !border-white "
              style={{ zIndex: 2, top: "15% " }}
            />
            <Handle
              type="target"
              position={Position.Left}
              id="sig_target"
              className="!w-3 !h-3 !bg-black !border-none"
              style={{ zIndex: 1, top: "15%" }}
            />
            <span className="absolute  text-[8px] top-[5%] text-center left-3  text-gray-200">
              SIG
            </span>
            <Handle
              type="source"
              position={Position.Left}
              id="vcc_source"
              className="!w-3 !h-3  !bg-transparent !border-white"
              style={{ zIndex: 2, top: "50%" }}
            />
            <Handle
              type="target"
              position={Position.Left}
              id="vcc_target"
              className="!w-3 !h-3 !bg-black !border-none"
              style={{ zIndex: 1, top: "50%" }}
            />
            <span className="absolute  text-[8px] text-center left-3 top-[40%] text-gray-200">
              VCC
            </span>
            <Handle
              type="source"
              position={Position.Left}
              id="gnd_servo_source"
              className="!w-3 !h-3 !bg-transparent !border-white "
              style={{ zIndex: 2, top: "85%" }}
            />
            <Handle
              type="target"
              position={Position.Left}
              id="gnd_servo_target"
              className="!w-3 !h-3 !bg-black !border-none"
              style={{ zIndex: 1, top: "85%" }}
            />
            <span className="absolute  text-[8px] text-center left-3 top-[75%] text-gray-200">
              GND
            </span>
          </>
        </div>
        <button
          onClick={onNodeRemove}
          className="absolute -top-8.5 -right-2 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-800  border-gray-400 transition-colors text-sm font-mono cursor-pointer opacity-0 group-hover:opacity-100"
          aria-label="Remover nó"
        >
          X
        </button>
      </div>
    </div>
  );
};
export default memo(servoMotorNode);

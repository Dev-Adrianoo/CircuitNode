import { Handle, Position, type NodeProps } from "reactflow";
import React, { memo, type MouseEvent } from "react";
import svg from "@/assets/arduino-svgrepo-com.svg";

//TODO: Pins para a board, cada pino com valor diferente
//:14 pinos digitais de 0 a 13
//:Os pinos digitais PWM são os 3,5,6,9,10,11 ---> permitem controle preciso sobre entrada de carga nos componentes, potencia de carga medida de 0 a 255
//:6 pinos analogicos de A0 a A5
//TOTAL:20 pinos I/O (entrada e saida)!

/**
 * Componente customizado do Arduino Uno para o React Flow.
 *
 * Estrutura:
 * - Cria duas linhas de pinos (superior e inferior) usando o componente <PinRow>.
 * - Os pinos digitais (0–13) ficam na parte superior.
 * - Os pinos analógicos (A0–A5) + alimentação (Vin, 3.3V, 5V, GND, RESET) ficam na parte inferior.
 * - Cada pino é representado por um <Handle>, com label acima ou abaixo dependendo da posição.
 * - O espaçamento horizontal entre os pinos é calculado dinamicamente para alinhar bem os conectores.
 * - No centro, a placa azul estilizada exibe o logo e o nome "Arduino Uno".
 * - Inclui também um botão de remover o nó no canto superior direito.
 *
 */

const digitalPins = Array.from({ length: 14 }, (_, i) => ({
  id: `d${i}`,
  label:
    i === 0
      ? "0/RX"
      : i === 1
      ? "1/TX"
      : `${i}${[3, 5, 6, 9, 10, 11].includes(i) ? "~" : ""}`,
  type: "both" as const,
}));

const reverseDigital = [...digitalPins].reverse();

const analogPins = ["A0", "A1", "A2", "A3", "A4", "A5"].map((a) => ({
  id: a.toLowerCase(),
  label: a,
  type: "both" as const,
}));

const powerPins = [
  { id: "reset", label: "RESET", type: "target" as const },
  { id: "3v3", label: "3.3V", type: "source" as const, style: "margin" },
  { id: "5v", label: "5V", type: "source" as const },
  { id: "gnd1", label: "GND", type: "target" as const },
  { id: "gnd2", label: "GND", type: "target" as const },
  { id: "vin", label: "Vin", type: "target" as const },
];

interface PinRowProps {
  pins: { id: string; label: string; type: "source" | "target" | "both" }[];
  side: "top" | "bottom";
}

const PinRow: React.FC<PinRowProps> = ({ pins, side }) => {
  const spacing = 100 / (pins.length + 0.6);
  return (
    <>
      {pins.map((pin, index) => {
        const x = `${(index + 1) * spacing - 2}%`;
        const pinPosition = side === "top" ? Position.Top : Position.Bottom;
        const handleClass =
          "!w-3 !h-3 rounded-full border-2 border-black bg-gray-300 shadow-sm";

        return (
          <div
            key={pin.id}
            style={{
              position: "absolute",
              left: x,
              ...(side === "top" ? { top: 0 } : { bottom: 0 }),
              transform: `translate(-50%, ${side === "top" ? "-50%" : "50%"})`,
            }}
          >
            <span
              className={`absolute left-1/2 -translate-x-1/2 text-xs font-mono text-gray-800 ${
                side === "top" ? "top-4" : "bottom-4"
              }`}
            >
              {pin.label}
            </span>

            {pin.type === "both" ? (
              <>
                <Handle
                  type="source"
                  position={pinPosition}
                  id={`${pin.id}_source`}
                  className={handleClass}
                  style={{ zIndex: 2 }}
                />
                <Handle
                  type="target"
                  position={pinPosition}
                  id={`${pin.id}_target`}
                  className={handleClass}
                  style={{ zIndex: 1 }}
                />
              </>
            ) : (
              <Handle
                type={pin.type}
                position={pinPosition}
                id={pin.id}
                className={handleClass}
              />
            )}
          </div>
        );
      })}
    </>
  );
};

const ArduinoUnoNode = ({ id, data }: NodeProps) => {
  const onNodeRemove = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (data.removeNodeFunc) {
      data.removeNodeFunc(id);
    }
  };

  return (
    <div
      className="flex bg-[#0068AA] flex-col border-2 border-[#006CAB] rounded-lg shadow-lg text-teal-900 group shadow-blue-900 box-shadow-custom"
      style={{ width: 510, height: 280 }}
    >
      {/* Botão de remover */}
      <button
        onClick={onNodeRemove}
        className="z-1000 absolute top-0 right-0 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center -mt-2 -mr-2 hover:bg-red-800 text-sm font-mono cursor-pointer opacity-0 group-hover:opacity-100"
        aria-label="Remover nó"
      >
        X
      </button>

      <div
        className="absolute top-9 left-0 right-57 flex justify-center px-8 text-xs font-bold text-gray-600"
        style={{ zIndex: 20 }}
      >
        <span>DIGITAL (PWM: ~)</span>
      </div>

      <div
        className="absolute top-0 left-0 right-0 bg-gray-200 rounded-t-lg"
        style={{ height: 52 }}
      />

      <PinRow pins={reverseDigital} side="top" />

      <div
        className="absolute bottom-9 left-0 right-0 flex justify-between px-8 text-xs font-bold text-gray-600"
        style={{ zIndex: 20 }}
      >
        <span>POWER</span>
        <div className="absolute top-1 left-1/2 w-px h-6 bg-gray-400 transform -translate-x-1/2" />
        <span>ANALOG IN</span>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 bg-gray-200 rounded-b-lg"
        style={{ height: 52 }}
      />

      <PinRow pins={[...powerPins, ...analogPins]} side="bottom" />

      <div className="flex-grow flex items-center justify-center rounded-lg bg-[#006CAB]">
        <div className="flex items-center gap-2">
          <img
            src={svg}
            className="flex items-center justify-center h-8 w-8"
            alt="Arduino Logo"
          />
          <div className="text-center">
            <p className="font-bold text-white text-2xl">Arduino Uno</p>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-5 w-full text-center text-xs font-mono text-white opacity-0 group-hover:opacity-100">
        {data.label}
      </div>
    </div>
  );
};
export default memo(ArduinoUnoNode);

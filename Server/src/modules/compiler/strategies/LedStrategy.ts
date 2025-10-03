import type { NodeComponent } from "../compiler_types";
import type { IComponentStrategy, codeParts } from "./IComponents_strategy";

export class LedStrategy implements IComponentStrategy {
  public generateCode(component: NodeComponent): codeParts {
    const { pin, mode, delay, duration, frequency } = component.properties;
    const varName = `ledPin${pin}`;

    let variables = `const int ${varName} = ${pin};\n`;
    let setup = `pinMode(${varName}, OUTPUT);\n`;
    let loop = "";

    switch (mode) {
      case 'direct':
        loop = `digitalWrite(${varName}, HIGH);\n`;
        break;

      case 'pulse':
        loop = `digitalWrite(${varName}, HIGH);\n\tdelay(${duration || 1000});\n\tdigitalWrite(${varName}, LOW);\n\tdelay(${delay || 0});\n`;
        break;

      case 'blink':
      default:
        const blink_delay = frequency > 0 ? (1000 / frequency) / 2 : 500;
        loop = `digitalWrite(${varName}, HIGH);\n\tdelay(${blink_delay});\n\tdigitalWrite(${varName}, LOW);\n\tdelay(${blink_delay});\n`;
        break;
    }

    return { variables, setup, loop };
  }
}
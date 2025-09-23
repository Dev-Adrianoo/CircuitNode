import type { NodeComponent } from "../compiler_types";
import type { IComponentStrategy, codeParts } from "./IComponents_strategy";

export class LedStrategy  implements IComponentStrategy {

  public generateCode(component: NodeComponent): codeParts {

      const pin: number = component.properties?.pin;
      const timer: number = (component.properties?.delay ?? 2000) / 2;
      const varName = `ledPin${pin}`

      const variables = `const int ${varName} = ${pin};\n`
      const setup = `pinMode(${varName}, OUTPUT);\n`;
      const loop = `digitalWrite(${varName}, HIGH);\n\tdelay(${timer});\n\tdigitalWrite(${varName}, LOW);\n\tdelay(${timer});\n`;

      return { variables, setup, loop }
  }
}
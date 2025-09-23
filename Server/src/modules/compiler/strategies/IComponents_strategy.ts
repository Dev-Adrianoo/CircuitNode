import type { NodeComponent } from "../compiler_types";

export interface codeParts {
  variables: string;
  setup: string,
  loop: string,
}

export interface IComponentStrategy {
  generateCode(component: NodeComponent): codeParts
}

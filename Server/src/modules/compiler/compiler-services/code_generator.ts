import type { NodeComponent } from "../compiler_types";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { IComponentStrategy, codeParts } from "../strategies/IComponents_strategy";
import { LedStrategy } from "../strategies/LedStrategy";


const strategies: { [key: string]: IComponentStrategy } = {
  led: new LedStrategy(),
}

const isSimpleCircuit = (components: NodeComponent[]): boolean => {
  return components.every(component => strategies[component.type] !== undefined);
};

export default async function generateArduinoCode(components: NodeComponent[]): Promise<string> {


  if (isSimpleCircuit(components)) {
    console.log("Using the fast programmatic generator...");

    let variableDeclarations: string = "";
    let setupCode: string = "";
    let loopCode: string = "";


    components.forEach(component => {

      const strategy = strategies[component.type]

      if (strategy) {
        const codeParts = strategy.generateCode(component);
        variableDeclarations += codeParts.variables;
        setupCode += codeParts.setup;
        loopCode += codeParts.loop;
      }
    });
    return `#include<Arduino.h>\n\n ${variableDeclarations}\nvoid setup(){ \n${setupCode}}\nvoid loop(){\n ${loopCode}}`

  } else {

    console.log("Using the powerful AI generator...");

    const GenAI = new GoogleGenerativeAI(process.env.API_KEY!);
    const model = GenAI.getGenerativeModel({ model: "gemini-pro" });
    const circuitData = JSON.stringify({ components }, null, 2);
    const prompt = `You are expert Arduino C++ code generator.
                        Your only job  is to write a complete and valid .ino file based on the circuit described in the JSON data below. The code must be simples and efficient. Do not add any extra text, comments or explanations. Just return the raw code.
                        ---
                        JSON circuit Data:
                        ${circuitData}
                        ---
                        `;
    const result = await model.generateContent(prompt);
    return result.response.text();
  }
}


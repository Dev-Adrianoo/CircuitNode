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

const selectModel = (components: NodeComponent[]): string => {
  const componentCount = components.length

  if (componentCount <= 3) {
    return "gemini-2.0-flash-exp"

  } else if (componentCount <= 8) {
    return "gpt-4o-mini";

  } else {
    return "claude-sonnet-4.5";

  }
}

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

    const selectedModel = selectModel(components);
    console.log("Using the powerful AI generator: " + selectedModel);

    const circuitData = JSON.stringify({ components }, null, 2);

    const response = await fetch("https://api.abacus.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [
          {
            role: "user",
            content: `You are an expert Arduino C++ code generator.
            Your only job is to write a complete and valid .ino file based on the circuit described in the JSON data below. The code must be simple and efficient. Do not add any extra text, comments or explanations. Just return the raw code.
            ------
            JSON circuit Data:
              ${circuitData}
            -----`
          }
        ],
        temperature: 0.5
      })
    });

    if(!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    const result = await response.json();
    return result.choices[0].message.content;
  }
}


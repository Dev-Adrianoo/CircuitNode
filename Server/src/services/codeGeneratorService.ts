import type { CircuitMappingData, NodeComponent } from "../types/index";

export default function generateArduinoCode(components: NodeComponent[]){

     let variableDeclarations:string = "";
     let setupCode:string = "";
     let loopCode:string= "";
     
     components.forEach(component =>{
       switch(component.type){
            case "led":

              const pin:number=  component.properties?.pin;
              const timer:number = component.properties?.delay / 2 ;
              const varName = `ledPin${pin}`

              variableDeclarations += `const int ${varName} = ${pin};\n`;
              setupCode += `pinMode(${varName}, OUTPUT);\n`;
              loopCode += `digitalWrite(${varName}, HIGH);\n delay(${timer};\n digitalWrite(${varName}, LOW);\n delay(${timer})\n)`;
              break;

              default:
                  console.warn("Data passed to generate code is invalid " + component.type);   

       };
     });  

     return `#include<Arduino.h>\n\n ${variableDeclarations}\n void setup(){ \n${setupCode}}\n void loop(){\n ${loopCode}} `
}

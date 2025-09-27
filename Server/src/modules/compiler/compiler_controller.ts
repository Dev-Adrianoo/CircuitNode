import { type Request, type Response } from "express";
import { type CircuitMappingData, type CompilerResult  } from "./compiler_types";
import generateArduinoCode from "./compiler-services/code_generator";
import { ArduinoCLIVerification } from "./compiler-utils/exec_verification";
import { handleCliExecution } from "./compiler-services/execution_helper";

export const compilerController = async (req: Request, res: Response) => {
  try {
    const { components, board } = req.body as CircuitMappingData;

    const generatedCode = await generateArduinoCode(components);
    
    console.log(`[DEBUG] - generated code in C++${generatedCode}`);

   const verifyJob = (tempDir: string) => ArduinoCLIVerification(board, tempDir)

   const verificationResult = await handleCliExecution(generatedCode, verifyJob);

     const finalResult: CompilerResult = {
      success: true,
      message: "code generated and verified succesfully!",
      data: verificationResult,
      generatedCode: generatedCode,
    };
    
        console.log(`Final result with generated code and object with all attributes ${finalResult}`)

    return res.status(200).json(finalResult);

  } catch (error: any) {
    console.error("error when verifying arduino code ", error.message);
    return res.status(500).json({ 
        success: false,
        error: "Server error when trying to load",
        details: error.message
       }
    );

  } 
};

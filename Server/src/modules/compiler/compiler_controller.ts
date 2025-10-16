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

   const executionResult = await handleCliExecution(generatedCode, board, verifyJob);

     const finalResult: CompilerResult = {
      success: true,
      message: "code generated and verified succesfully!",
      data: executionResult.stdout,
      generatedCode: generatedCode,
      hex: executionResult.hex,
    };
    
    console.log(`Final result includes hex content.`)

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

export const compileRawController = async (req: Request, res: Response) => {
  try {
    const { code, board } = req.body as { code: string, board: string };

    if (!code || !board) {
      return res.status(400).json({ success: false, error: "Missing 'code' or 'board' in request body." });
    }

    const compileJob = (tempDir: string) => ArduinoCLIVerification(board, tempDir);

    const executionResult = await handleCliExecution(code, board, compileJob);

    const finalResult = {
      success: true,
      message: "Code compiled successfully!",
      hex: executionResult.hex,
    };
    
    return res.status(200).json(finalResult);

  } catch (error: any) {
    console.error("error when compiling raw arduino code ", error.message);
    return res.status(500).json({ 
        success: false,
        error: "Server error when trying to compile",
        details: error.message
       }
    );
  } 
};

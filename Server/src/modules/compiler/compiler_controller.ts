import { type Request, type Response } from "express";
import { type CircuitMappingData, type CompilerResult } from "./compiler_types";
import generateArduinoCode from "./compiler-services/code_generator";
import createTempDirectory from "./compiler-utils/create_tempdir ";
import { basename } from "path";
import createTempFile from "./compiler-utils/create_tempfile";
import { ArduinoCLIVerification } from "./compiler-utils/exec_verification";
import { cleanupDir } from "./compiler-utils/tempdir_cleanup";
import { handleCliExecution } from "./compiler-services/execution_helper";

export const compilerController = async (req: Request, res: Response) => {

  try {
    const { components, board } = req.body as CircuitMappingData;
    const generatedCode = await generateArduinoCode(components);
    console.log(generatedCode);

    const verifyJob = (tempDir: string) => {
      return ArduinoCLIVerification(board, tempDir);
    }

   const verifyResult = await handleCliExecution(generatedCode, verifyJob);

   
    const finalResult: CompilerResult = {
      success: true,
      data: verifyResult,
      generatedCode: generatedCode,
    };

    return res.status(200).json(finalResult);

  } catch (error) {
    console.error("error when verifying arduino code ", error);
    return res.status(500).json({ error: "Server error when trying to load " });

  } 
};

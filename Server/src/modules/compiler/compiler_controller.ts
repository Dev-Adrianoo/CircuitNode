import { type Request, type Response } from "express";
import { type CircuitMappingData, type CompilerResult } from "./compiler_types";
import generateArduinoCode from "./compiler-services/code_generator";
import createTempDirectory from "./compiler-utils/create_tempdir ";
import { basename } from "path";
import createTempFile from "./compiler-utils/create_tempfile";
import ArduinoCLIVerification from "./compiler-utils/exec_fIle";
import { cleanuoDir } from "./compiler-utils/tempdir_cleanup";

export const compilerController = async (req: Request, res: Response) => {
  let tempDir: string | undefined;
  try {
    const { components, board } = req.body as CircuitMappingData;

    const generatedCode = generateArduinoCode(components);
    console.log(generatedCode);
    tempDir = await createTempDirectory();

    const tempFileName = basename(tempDir);
    const tempContent = await createTempFile(
      tempDir,
      `${tempFileName}`,
      generatedCode
    );
    const verifyCode = await ArduinoCLIVerification(
      "arduino-cli",
      board,
      tempDir
    );

    const finalResult: CompilerResult = {
      success: true,
      data: verifyCode,
      generatedCode: generatedCode,
    };

    return res.status(200).json(finalResult);
  } catch (error) {
    console.error("error when verifying arduino code ", error);
    return res.status(500).json({ error: "Server error when trying to load " });
  } finally {
    if (tempDir) {
      await cleanuoDir(tempDir);
    }
  }
};

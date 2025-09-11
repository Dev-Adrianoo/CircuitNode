import { type Request, type Response } from "express";
import { type CircuitMappingData } from "./compiler_types";
import FileWritter from "modules/compiler/compiler-utils/file_writter";

import generateArduinoCode from "./compiler-services/code_generator";

export const compilerController = async (req: Request, res: Response) => {
  try {
    const { components, board } = req.body as CircuitMappingData;

    const code_generator = generateArduinoCode;
    const CLIReponse = FileWritter(code_generator(components), board);
    return CLIReponse
    
  } catch (error) {
    console.error("error when verifying arduino code ");
    res.status(500).json({ error: "Server error when trying to load " });
  }
};

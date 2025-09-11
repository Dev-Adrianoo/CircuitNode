import { type Request, type Response } from "express";
import { type CircuitMappingData } from "../types/types";
import FileWritter from "services/fileWritterService";
import generateArduinoCode from "services/codeGeneratorService";
import ArduinoCLIVerification from "services/execFIleService";

export const compilerController = async (req: Request, res: Response) => {
  try {
    const { components, board } = req.body as CircuitMappingData;

    const code_generator = generateArduinoCode;
    FileWritter(code_generator(components), board);
  } catch (error) {
    console.error("error when verifying arduino code ");
    res.status(500).json({ error: "Server error when trying to load " });
  }
};

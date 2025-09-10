import { type Request, type Response } from "express";
import { type CircuitMappingData } from "../types/index";



export const verifyArduinoCode = async (req: Request, res: Response) => {
   try {
      const { components, board } = req.body as CircuitMappingData;

      if (!components || !board) {
         res.status(400).json({ error: "Missing componennts for resolution" })
      }
      const generatedCode = "";

   } catch (error) {
      console.error("error when verifying arduino code ")
      res.status(500).json({ error: 'Server error when trying to load ' });
   }

}
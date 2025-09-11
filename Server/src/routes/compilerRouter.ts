import { compilerController } from "controllers/compilerController";
import express, { type Request, type Response, type Router } from "express";
import generateArduinoCode from "services/codeGeneratorService";
import ArduinoCLIVerification from "services/execFIleService";
import FileWritter from "services/fileWritterService";
import type { CircuitMappingData, NodeComponent } from "types/types";

const routes: Router = express.Router();

routes.post("/compiler/codehub", (req: Request, res: Response) => {
  try {
    compilerController(req, res);
  } catch (error) {
    res.send("Dados enviados são invalidos");
  }
});
routes.get("/compiler/message", (req, res) => {
  res.send("here stays the response");
});

export default routes;

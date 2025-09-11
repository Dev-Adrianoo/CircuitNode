import { compilerController } from "modules/compiler/compiler_controller";
import express, { type Request, type Response, type Router } from "express";

const routes: Router = express.Router();

routes.post("/compiler/codehub", (req: Request, res: Response) => {
  try {
    compilerController(req, res);
    res.status(200).json({compiler: ""})
  } catch (error) {
    res.send("Dados enviados são invalidos");
  }
});
routes.get("/compiler/message", (req, res) => {
  res.send("here stays the teste");
});

export default routes;

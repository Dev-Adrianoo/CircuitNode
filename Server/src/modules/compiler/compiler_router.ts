import { compilerController } from "modules/compiler/compiler_controller";
import express, { type Request, type Response, type Router } from "express";

const routes: Router = express.Router();

routes.post("/compiler/codehub", compilerController);

routes.get("/compiler/message", (req, res) => {
  return res.send("here stays the teste");
});

export default routes;

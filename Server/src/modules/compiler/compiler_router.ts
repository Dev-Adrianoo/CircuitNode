import { compilerController, compileRawController } from "./compiler_controller";

import express, {type Router } from "express";

const routes: Router = express.Router();

routes.post("/compiler/codehub", compilerController);
routes.post("/compiler/compile", compileRawController);

routes.get("/compiler/message", (req, res) => {
  return res.send("here stays the teste");
});


export default routes;

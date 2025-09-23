import { compilerController } from "./compiler_controller";

import express, {type Router } from "express";
import { uploadController } from "./upload_controller";

const routes: Router = express.Router();

routes.post("/compiler/codehub", compilerController);

routes.post("/compiler/upload", uploadController)

routes.get("/compiler/message", (req, res) => {
  return res.send("here stays the teste");
});


export default routes;

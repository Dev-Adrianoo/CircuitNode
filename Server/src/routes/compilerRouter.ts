import express, { type Request, type Response, type Router } from "express";
import generateArduinoCode from "services/codeGeneratorService";
import FileWritter from "services/fileWritterService";
import type { NodeComponent } from "types";

const routes: Router = express.Router();

routes.post("/compiler/codehub", (req: Request, res: Response) => {

    try {
        const workflowComponents: NodeComponent[] = req.body;

        FileWritter(generateArduinoCode(workflowComponents));

    } catch (error) {
        res.send("Dados enviados são invalidos")
    }

});
routes.get("/compiler/message", (req, res) => {
    res.send("here stays the response");
});

export default routes;
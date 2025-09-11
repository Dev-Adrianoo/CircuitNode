import express, { type Application, type Request, type Response, type Router } from "express";
import router from "@routes/compilerRouter";
import gracefulShutDown from "services/gracefulShutdown";
import { type ErrorRequestHandler } from "express";

const app: Application = express()
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;


     {/*TODO: implementar URL de redicionamento em casos de error no servidor*/}

app.use(express.json());    

app.use("/circuit_node", router)

app.listen(PORT, () => {

    console.log(`FURACÃO ${PORT}`)
});

process.on("SIGINT", gracefulShutDown);
process.on("SIGTERM", gracefulShutDown)
import express, { type Application, type Request, type Response, type Router } from "express";
import router from "@routes/compilerRouter";

const app: Application = express()
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json());

app.use("/circuit_node", router)

app.listen(PORT, () => {

    console.log(`FURACÃO ${PORT}`)
});

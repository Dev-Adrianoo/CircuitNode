import express, { Express } from "express";
import CompilerRouter from "./routes/compilerRouter";

const app: Express = express()
const  PORT = process.env.PORT || 3001;

app.use(express.json());
app.use("/circuit_node", CompilerRouter);
app.use("")

app.listen(PORT, ()=>{
      
    console.log(`OLÁ MUNDO ${PORT}`)
});
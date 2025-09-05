import express from "express";
import router from "./routes/compilerRouter.js"
;
const app: express.Express = express()
const  PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/circuit_node", router);


app.listen(PORT, ()=>{
      
    console.log(`FURACÃO ${PORT}`)
});
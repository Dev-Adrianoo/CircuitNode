import express , { type Application, type Request, type Response, type Router} from "express";
import AuthRouter from "@routes/AuthRouter";

const app: Application = express()
const PORT:number  =  process.env.PORT ? parseInt(process.env.PORT) : 3000;


app.use(express.json());

app.use(AuthRouter )

app.listen(PORT, ()=>{  
      
    console.log(`FURACÃO ${PORT}`)
});
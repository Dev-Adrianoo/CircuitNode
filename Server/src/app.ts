import express, {
  type Application,
  type Request,
  type Response,
  type Router,
} from "express";
import router from "modules/compiler/compiler_router";
import cors from "cors"
const app: Application = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

{
  //TODO: implementar URL de redicionamento em casos de error no servidor
}

app.use(express.json());

app.use(cors({
  origin:  'http://localhost:5173'
}))
app.use("/api", router);
app.listen(PORT, () => {
  console.log(`FURACÃO ${PORT}`);
});

export default app;

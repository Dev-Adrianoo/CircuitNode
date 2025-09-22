import express, {
  type Application,
  type Request,
  type Response,
  type Router,
} from "express";
import router from "modules/compiler/compiler_router";
import swaggerUI from "swagger-ui-express";
import fs from "fs"
import yaml from "js-yaml"


const app: Application = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

{
  //TODO: implementar URL de redicionamento em casos de error no servidor
}

const swaggerDocument = yaml.load(fs.readFileSync("./swagger.yaml", "utf8")) as object;

app.use('/api-docs',swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`STORM ${PORT}`);
});

export default app;

import express, {
  type Application,
} from "express";
import router from "./modules/compiler/compiler_router";
import swaggerUI from "swagger-ui-express";
import fs from "fs";
import yaml from "js-yaml";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Application = express();

app.use(express.json());

const swaggerPath = path.resolve(__dirname, '../swagger.yaml');
const swaggerDocument = yaml.load(fs.readFileSync(swaggerPath, "utf8")) as object;

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use("/api", router);

export default app;

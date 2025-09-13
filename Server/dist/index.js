import express, {} from "express";
import AuthRouter from "./routes/AuthRouter";
const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
app.use(express.json());
app.use(AuthRouter);
app.listen(PORT, () => {
    console.log(`FURACÃO ${PORT}`);
});

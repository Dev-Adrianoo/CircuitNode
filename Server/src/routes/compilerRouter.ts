import express, { type Router } from "express";

const routes: express.Router = express.Router();

routes.get("/compiler/message", (req, res)=>{
    res.send("here stays the response");
})

export default routes;
import express, { Router } from "express";
const AuthRouter = Router();
AuthRouter.get("/auth", (req, res) => {
    res.json({ message: "auth router teste " });
});
export default AuthRouter;

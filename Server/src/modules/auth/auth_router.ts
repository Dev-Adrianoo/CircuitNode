import express, {  type Request, type Response,  Router } from "express";

const AuthRouter: Router =  Router();

AuthRouter.get("/auth", (req: Request, res: Response)=>{
  res.json({message:"auth router teste "})

})

export default AuthRouter;
import { Router } from "express";

const router: Router = Router();

router.post("/compiler/post",)

router.get("/compiler/get", (req, res)=>{
    res.json({ message: "here stays the response"});
})

export default router;
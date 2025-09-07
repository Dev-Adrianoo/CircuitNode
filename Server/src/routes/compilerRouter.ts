import express from "express";

const router: express.Router = express.Router();


router.get("/compiler/message", (req, res)=>{
    res.json({ message: "here stays the response"});
})

export default router;
import {} from "express";
import {} from "../types/index";
export const verifyArduinoCode = async (req, res) => {
    try {
        const { components, board } = req.body;
        if (!components || !board) {
            res.status(400).json({ error: "Missing componennts for resolution" });
        }
        const generatedCode = "";
    }
    catch (error) {
        console.error("error when verifying arduino code ");
        res.status(500).json({ error: 'Server error when trying to load ' });
    }
};

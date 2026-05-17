const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const authMiddleware = require("../middleware/authMiddleware");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
console.log("Gemini Key Loaded:", process.env.GEMINI_API_KEY?.slice(0, 10));
router.post("/ask", authMiddleware, async (req, res) => {
    try {
        const { question } = req.body;

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
        });
        console.log("Using model: gemini-2.5-flash-latest");

        const result = await model.generateContent(question);
        const response = await result.response;
        const answer = result.response.text();

        res.json({ answer });

    } catch (error) {
        console.log("AI Error:", error);
        res.status(500).json({
            message: "AI Error",
            error: error.message,
        });
    }
});
router.get("/test", (req, res) => {
    res.send("AI route deployed successfully");
});

module.exports = router;
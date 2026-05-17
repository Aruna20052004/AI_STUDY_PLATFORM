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
        const answer = result.response.text();

        res.json({ answer });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:
                error.status === 429
                    ? "AI quota exceeded. Try again shortly."
                    : "AI Error",
            error: error.message,
        });
    }
});

module.exports = router;
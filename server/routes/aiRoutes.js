const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const authMiddleware = require("../middleware/authMiddleware");
const Chat = require("../models/Chat");
const multer = require("multer");
const { parseOffice } = require("officeparser");

const upload = multer({ storage: multer.memoryStorage() });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
console.log("Gemini Key Loaded:", process.env.GEMINI_API_KEY?.slice(0, 10));

// Extracts ASCII and UTF-16LE printable strings from legacy binary files (e.g., .ppt, .pps, .doc)
const extractTextFromBinary = (buffer) => {
    let result = [];
    
    // 1. Extract ASCII strings
    let currentAscii = [];
    for (let i = 0; i < buffer.length; i++) {
        const char = buffer[i];
        if (char >= 32 && char <= 126) {
            currentAscii.push(String.fromCharCode(char));
        } else {
            if (currentAscii.length >= 4) {
                const str = currentAscii.join("").trim();
                if (/[a-zA-Z0-9]{2,}/.test(str)) {
                    result.push(str);
                }
            }
            currentAscii = [];
        }
    }
    
    // 2. Extract UTF-16LE strings (common in legacy MS Office files)
    let currentUtf16 = [];
    for (let i = 0; i < buffer.length - 1; i += 2) {
        const char = buffer[i];
        const nextChar = buffer[i + 1];
        if (char >= 32 && char <= 126 && nextChar === 0) {
            currentUtf16.push(String.fromCharCode(char));
        } else {
            if (currentUtf16.length >= 4) {
                const str = currentUtf16.join("").trim();
                if (/[a-zA-Z0-9]{2,}/.test(str)) {
                    result.push(str);
                }
            }
            currentUtf16 = [];
        }
    }

    const junkWords = new Set(["workbook", "powerpoint", "document", "summaryinformation", "compobj", "props", "objectpool", "currentuser"]);
    const cleaned = result
        .map(s => s.replace(/[\x00-\x1f\x7f-\xff]/g, "")) // strip control characters
        .filter(s => s.length >= 4)
        .filter(s => !junkWords.has(s.toLowerCase()))
        .filter(s => !/^[0-9\s\-_.:,;'"()\[\]{}!@#$%^&*+=<>?/|\\~`]+$/.test(s));

    const finalLines = [];
    let lastLine = "";
    for (const line of cleaned) {
        if (line !== lastLine) {
            finalLines.push(line);
            lastLine = line;
        }
    }

    return finalLines.join(" ");
};

const parseFileBuffer = async (buffer, originalname) => {
    const ext = originalname.split('.').pop().toLowerCase();
    try {
        const docTextObj = await parseOffice(buffer, { fileType: ext });
        if (typeof docTextObj === "string") {
            return docTextObj;
        } else if (docTextObj && typeof docTextObj === "object") {
            return docTextObj.text || docTextObj.data || "";
        }
        return "";
    } catch (error) {
        console.error("parseOffice failed, falling back to binary string extraction:", error.message);
        const fallbackText = extractTextFromBinary(buffer);
        if (fallbackText && fallbackText.length > 20) {
            console.log("Successfully extracted text from binary fallback. Length:", fallbackText.length);
            return fallbackText;
        }
        throw error;
    }
};

// ASK AI (Persist conversation to MongoDB, supports file upload context)
router.post("/ask", authMiddleware, upload.single("file"), async (req, res) => {
    try {
        const { question } = req.body;
        const file = req.file;

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: "You are a helpful study assistant. Your answers must be extremely crisp, concise, direct, and on-point. Avoid long preambles, verbose explanations, or unnecessary fluff.",
        });
        console.log("Using model: gemini-2.5-flash");

        let parts = [];
        let finalQuestion = question;
        let parseWarning = "";

        if (file) {
            if (file.mimetype.startsWith("image/")) {
                const imagePart = {
                    inlineData: {
                        data: file.buffer.toString("base64"),
                        mimeType: file.mimetype
                    }
                };
                parts.push(imagePart);
                parts.push(question);
            } else {
                try {
                    const docText = await parseFileBuffer(file.buffer, file.originalname);
                    if (docText) {
                        finalQuestion = `Context from uploaded document (${file.originalname}):\n"""\n${docText}\n"""\n\nUser Question/Instruction: ${question}`;
                    } else {
                        parseWarning = "No text could be extracted from this document.";
                    }
                } catch (err) {
                    console.log("File parsing error:", err);
                    parseWarning = "Could not parse this file format. Please upload PDF, Word (docx), or PPTX instead.";
                }
                parts.push(finalQuestion);
            }
        } else {
            parts.push(question);
        }

        const result = await model.generateContent(parts);
        const response = await result.response;
        let answer = result.response.text();

        if (parseWarning) {
            answer = `⚠️ **System Warning: ${parseWarning}**\n\n${answer}`;
        }

        // Save conversation (show file attachments in question history log)
        const newChat = new Chat({
            studentId: req.user.userId,
            question: file ? `${question} [Attached: ${file.originalname}]` : question,
            answer,
        });
        await newChat.save();

        res.json({ answer });

    } catch (error) {
        console.log("AI Error:", error);
        res.status(500).json({
            message: "AI Error",
            error: error.message,
        });
    }
});

// GET CHAT HISTORY
router.get("/history", authMiddleware, async (req, res) => {
    try {
        const chats = await Chat.find({ studentId: req.user.userId }).sort({ createdAt: 1 });
        res.json(chats);
    } catch (error) {
        console.log("FETCH CHAT HISTORY ERROR:", error);
        res.status(500).json({
            message: "Error fetching chat history",
            error: error.message,
        });
    }
});

// DELETE ALL CHAT HISTORY FOR LOGGED IN STUDENT
router.delete("/history", authMiddleware, async (req, res) => {
    try {
        await Chat.deleteMany({ studentId: req.user.userId });
        res.json({ message: "Chat history cleared successfully" });
    } catch (error) {
        console.log("CLEAR CHAT HISTORY ERROR:", error);
        res.status(500).json({
            message: "Error clearing chat history",
            error: error.message,
        });
    }
});

router.get("/test", (req, res) => {
    res.send("AI route deployed successfully");
});

module.exports = router;
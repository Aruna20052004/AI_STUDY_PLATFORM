const express = require("express");
const router = express.Router();

const Note = require("../models/Note");
const authMiddleware = require("../middleware/authMiddleware");

// CREATE NOTE
router.post("/create", authMiddleware, async (req, res) => {
    try {
        const { title, content } = req.body;

        const newNote = new Note({
            title,
            content,
        });

        await newNote.save();

        res.json({
            message: "Note Created Successfully",
        });

    } catch (error) {
        console.log("CREATE NOTE ERROR:", error);

        res.status(500).json({
            message: "Error Creating Note",
            error: error.message,
        });
    }
});

// GET ALL NOTES
router.get("/", authMiddleware, async (req, res) => {
    try {
        const notes = await Note.find().sort({ _id: -1 });

        res.json(notes);

    } catch (error) {
        console.log("FETCH NOTES ERROR:", error);

        res.status(500).json({
            message: "Error Fetching Notes",
            error: error.message,
        });
    }
});

// DELETE NOTE
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        await Note.findByIdAndDelete(req.params.id);

        res.json({
            message: "Note Deleted Successfully",
        });

    } catch (error) {
        console.log("DELETE NOTE ERROR:", error);

        res.status(500).json({
            message: "Error Deleting Note",
            error: error.message,
        });
    }
});

// UPDATE NOTE
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { title, content } = req.body;

        await Note.findByIdAndUpdate(req.params.id, {
            title,
            content,
        });

        res.json({
            message: "Note Updated Successfully",
        });

    } catch (error) {
        console.log("UPDATE NOTE ERROR:", error);

        res.status(500).json({
            message: "Error Updating Note",
            error: error.message,
        });
    }
});

module.exports = router;
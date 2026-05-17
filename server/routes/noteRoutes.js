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
            user: req.user,
        });

        await newNote.save();

        res.json({
            message: "Note Created Successfully",
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Error Creating Note",
        });

    }

});


// GET ALL NOTES

router.get("/", authMiddleware, async (req, res) => {

    try {

        const notes = await Note.find({ user: req.user, }).sort({ _id: -1 });

        res.json(notes);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Error Fetching Notes",
        });

    }

});

router.delete("/:id", authMiddleware, async (req, res) => {

    try {

        await Note.findByIdAndDelete({ _id: req.params.id, user: req.user, });

        res.json({
            message: "Note Deleted Successfully",
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Error Deleting Note",
        });

    }

});

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

        console.log(error);

        res.status(500).json({
            message: "Error Updating Note",
        });

    }

});

module.exports = router;
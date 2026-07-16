const express = require("express");

const router = express.Router();

const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");


// CREATE TASK

router.post("/create", authMiddleware, async (req, res) => {

    try {

        const { title } = req.body;

        const newTask = new Task({
            title,
            studentId: req.user.userId,
        });

        await newTask.save();

        res.json({
            message: "Task Created Successfully",
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Error Creating Task",
        });

    }

});


// GET TASKS

router.get("/", authMiddleware, async (req, res) => {

    try {

        const tasks = await Task.find({ studentId: req.user.userId }).sort({ _id: -1 });

        res.json(tasks);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Error Fetching Tasks",
        });

    }

});


// UPDATE TASK STATUS

router.put("/:id", authMiddleware, async (req, res) => {

    try {

        const task = await Task.findOne({ _id: req.params.id, studentId: req.user.userId });

        if (!task) {
            return res.status(404).json({
                message: "Task not found or unauthorized",
            });
        }

        task.completed = !task.completed;

        await task.save();

        res.json({
            message: "Task Updated",
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Error Updating Task",
        });

    }

});


// DELETE TASK

router.delete("/:id", authMiddleware, async (req, res) => {

    try {

        const task = await Task.findOneAndDelete({ _id: req.params.id, studentId: req.user.userId });

        if (!task) {
            return res.status(404).json({
                message: "Task not found or unauthorized",
            });
        }

        res.json({
            message: "Task Deleted",
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Error Deleting Task",
        });

    }

});

module.exports = router;
const express = require("express");

const router = express.Router();

const Task = require("../models/Task");


// CREATE TASK

router.post("/create", async (req, res) => {

    try {

        const { title } = req.body;

        const newTask = new Task({
            title,
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

router.get("/", async (req, res) => {

    try {

        const tasks = await Task.find().sort({ _id: -1 });

        res.json(tasks);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Error Fetching Tasks",
        });

    }

});


// UPDATE TASK STATUS

router.put("/:id", async (req, res) => {

    try {

        const task = await Task.findById(req.params.id);

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

router.delete("/:id", async (req, res) => {

    try {

        await Task.findByIdAndDelete(req.params.id);

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
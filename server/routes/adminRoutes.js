const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const User = require("../models/User");
const Note = require("../models/Note");
const Task = require("../models/Task");
const Chat = require("../models/Chat");

// Secure all admin routes with auth and admin role
router.use(authMiddleware);
router.use(roleMiddleware(["admin"]));

// GET ALL USERS (excluding passwords)
router.get("/users", async (req, res) => {
    try {
        const users = await User.find({}, "-password").sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        console.error("ADMIN GET USERS ERROR:", error);
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
});

// DELETE A USER (cascade delete their notes, tasks, chats)
router.delete("/users/:id", async (req, res) => {
    try {
        const userId = req.params.id;

        // Prevent self-deletion
        if (userId === req.user.userId.toString()) {
            return res.status(400).json({ message: "You cannot delete your own admin account" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Delete associated records
        await Note.deleteMany({ studentId: userId });
        await Task.deleteMany({ studentId: userId });
        await Chat.deleteMany({ studentId: userId });

        // Delete user
        await User.findByIdAndDelete(userId);

        res.json({ message: "User and all associated data deleted successfully" });
    } catch (error) {
        console.error("ADMIN DELETE USER ERROR:", error);
        res.status(500).json({ message: "Error deleting user", error: error.message });
    }
});

// GET ALL NOTES (populated with student username)
router.get("/notes", async (req, res) => {
    try {
        const search = req.query.search || "";
        const query = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { content: { $regex: search, $options: "i" } }
            ];
        }

        const notes = await Note.find(query)
            .populate("studentId", "username email")
            .sort({ createdAt: -1 });

        res.json(notes);
    } catch (error) {
        console.error("ADMIN GET NOTES ERROR:", error);
        res.status(500).json({ message: "Error fetching notes", error: error.message });
    }
});

// GET ALL TASKS (populated with student username)
router.get("/tasks", async (req, res) => {
    try {
        const tasks = await Task.find({})
            .populate("studentId", "username email")
            .sort({ createdAt: -1 });

        res.json(tasks);
    } catch (error) {
        console.error("ADMIN GET TASKS ERROR:", error);
        res.status(500).json({ message: "Error fetching tasks", error: error.message });
    }
});

// GET ALL CHATS (populated with student username)
router.get("/chats", async (req, res) => {
    try {
        const chats = await Chat.find({})
            .populate("studentId", "username email")
            .sort({ createdAt: -1 });

        res.json(chats);
    } catch (error) {
        console.error("ADMIN GET CHATS ERROR:", error);
        res.status(500).json({ message: "Error fetching chats", error: error.message });
    }
});

// GET ANALYTICS OVERVIEW
router.get("/analytics", async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ role: "student" });
        const totalAdmins = await User.countDocuments({ role: "admin" });
        const totalNotes = await Note.countDocuments({});
        const totalTasks = await Task.countDocuments({});
        const completedTasks = await Task.countDocuments({ completed: true });
        const totalChats = await Chat.countDocuments({});

        res.json({
            totalStudents,
            totalAdmins,
            totalNotes,
            totalTasks,
            completedTasks,
            totalChats
        });
    } catch (error) {
        console.error("ADMIN GET ANALYTICS ERROR:", error);
        res.status(500).json({ message: "Error fetching analytics", error: error.message });
    }
});

module.exports = router;

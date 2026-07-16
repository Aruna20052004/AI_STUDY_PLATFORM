const express = require("express");

const router = express.Router();

const User = require("../models/User");

const jwt = require("jsonwebtoken");


// SIGNUP ROUTE

router.post("/signup", async (req, res) => {

    try {

        const { username, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {

            return res.status(400).json({
                message: "User already exists",
            });

        }

        let userRole = "student";
        if (role && ["student", "admin"].includes(role)) {
            userRole = role;
        }

        const newUser = new User({
            username,
            email,
            password,
            role: userRole,
        });

        await newUser.save();

        const token = jwt.sign(

            {
                id: newUser._id,
                userId: newUser._id,
                role: newUser.role,
            },

            process.env.JWT_SECRET

        );

        res.json({
            message: "User Registered Successfully",
            token,
            role: newUser.role,
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Error Registering User",
        });

    }

});


// LOGIN ROUTE

router.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(404).json({
                message: "User not found",
            });

        }

        if (user.password !== password) {

            return res.status(400).json({
                message: "Invalid Password",
            });

        }

        const token = jwt.sign(

            {
                id: user._id,
                userId: user._id,
                role: user.role,
            },

            process.env.JWT_SECRET

        );

        res.json({

            message: "Login Successful",

            token,
            role: user.role,

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Login Error",
        });

    }

});

// GET PROFILE
const authMiddleware = require("../middleware/authMiddleware");
router.get("/profile", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId, "-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.log("GET PROFILE ERROR:", error);
        res.status(500).json({ message: "Error fetching profile" });
    }
});

module.exports = router;
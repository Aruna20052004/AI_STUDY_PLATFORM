const express = require("express");

const router = express.Router();

const User = require("../models/User");

const jwt = require("jsonwebtoken");


// SIGNUP ROUTE

router.post("/signup", async (req, res) => {

    try {

        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {

            return res.status(400).json({
                message: "User already exists",
            });

        }
        const token = jwt.sign(

            {
                id: newUser._id,
            },

            process.env.JWT_SECRET

        );
        const newUser = new User({
            username,
            email,
            password,
        });

        await newUser.save();

        res.json({
            message: "User Registered Successfully",
        });

    } catch (error) {

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
                id: existingUser._id,
            },

            process.env.JWT_SECRET

        );

        res.json({

            message: "Login Successful",

            token,

        });

    } catch (error) {

        res.status(500).json({
            message: "Login Error",
        });

    }

});

module.exports = router;
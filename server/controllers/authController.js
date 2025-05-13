const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

// @desc Register a new user
// @route POST /api/users/register
// @access Public
const registerUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, phone, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "⚠ Passwords do not match!" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "⚠ Email is already registered!" });
        }

        // ✅ Secure Password Hashing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log("🔑 Hashed Password Before Saving:", hashedPassword);

        const newUser = new User({ name, email, phone, password: hashedPassword });
        await newUser.save();

        // ✅ Generate JWT Token
        const token = generateToken(newUser._id);

        res.status(201).json({
            message: "🎉 User registered successfully!",
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
            token,
        });
    } catch (error) {
        console.error("❌ Registration error:", error);
        res.status(500).json({ error: error.message || "🚨 Server error! Unable to register user." });
    }
};

// @desc Authenticate user & get token
// @route POST /api/users/login
// @access Public
const loginUser = async (req, res) => {
    try {
        console.log("🔍 Incoming Login Request:", req.body);

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "⚠ Email and password are required!" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            console.log("❌ No user found for email:", email);
            return res.status(400).json({ error: "⚠ User not found!" });
        }

        // ✅ Check password comparison
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("🔍 Password Match:", isMatch);

        if (!isMatch) {
            return res.status(400).json({ error: "⚠ Invalid credentials!" });
        }

        console.log("🔑 Generating JWT Token...");
        const token = generateToken(user._id);

        console.log("✅ Login successful:", { userId: user._id, token });
        res.status(200).json({ message: "🔓 Login successful!", token });
    } catch (error) {
        console.error("❌ Login error:", error);
        res.status(500).json({ error: "🚨 Server error! Check logs for details." });
    }
};

module.exports = { registerUser, loginUser };
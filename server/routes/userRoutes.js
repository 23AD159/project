const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const {
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser
} = require("../controllers/userController");

const User = require("../models/User"); // ✅ Ensure correct file path

// ✅ Secure User Routes (No duplicate login/register handling)
router.route("/profile")
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

router.route("/")
    .get(protect, admin, getUsers);

router.route("/:id")
    .delete(protect, admin, deleteUser)
    .get(protect, admin, getUserById)
    .put(protect, admin, updateUser);

// ✅ Temporary open test route for saving user data from Postman
router.post("/adduser", async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).send("User saved successfully");
    } catch (error) {
        console.error("❌ Error saving user:", error);
        res.status(500).send("Error saving user: " + error.message);
    }
});

module.exports = router;
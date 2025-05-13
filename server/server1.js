const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables

// ✅ Ensure environment variables exist
if (!process.env.MONGO_URI) {
    console.error("❌ Missing MONGO_URI in .env file");
    process.exit(1);
}
if (!process.env.JWT_SECRET) {
    console.error("❌ Missing JWT_SECRET in .env file");
    process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ✅ Fix request body issue

// ✅ Import Routes
const authRoutes = require("./routes/authRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const userRoutes = require("./routes/userRoutes"); // ✅ Added missing userRoutes import

// ✅ Ensure correct API routing
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/users", userRoutes); // ✅ Integrated User Routes

// ✅ MongoDB Connection with retry logic
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ MongoDB connected successfully");
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error.message);
        setTimeout(connectDB, 5000); // 🔄 Retry after 5s if fails
    }
};
connectDB();

// ✅ Handle app termination (Prevents MongoDB crashes)
process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("⚠ MongoDB disconnected due to app termination");
    process.exit(0);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
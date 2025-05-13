const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    phone: { type: String, required: true },
    role: { type: String, enum: ["patient", "doctor", "admin"], default: "patient" },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    profilePicture: { type: String, default: "" },
    medicalHistory: [
      {
        condition: String,
        diagnosis: String,
        treatment: String,
        diagnosedDate: Date,
      },
    ],
    prescriptions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Prescription" }],
    appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Appointment" }],
  },
  { timestamps: true }
);

// ✅ Hash Password Before Saving (Only If Modified)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log("🔑 Hashed Password Before Save:", this.password);
    next();
  } catch (err) {
    console.error("❌ Password Hashing Error:", err);
    next(err);
  }
});

// ✅ Compare Password with Stored Hash
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    console.log("🔍 Comparing:", candidatePassword, "with Hash:", this.password);
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log("✅ Password Match:", isMatch);
    return isMatch;
  } catch (err) {
    console.error("❌ Password Comparison Error:", err);
    throw err;
  }
};

// ✅ Remove Password from API Responses
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
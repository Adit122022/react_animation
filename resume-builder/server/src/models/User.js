const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },
    subscription: {
      type: String,
      enum: ["free", "premium"],
      default: "free",
    },
    subscriptionExpiry: {
      type: Date,
      default: null,
    },
    resumeCount: {
      type: Number,
      default: 0,
    },
    resumes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Resume",
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  },
);

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Check if user can create resume
userSchema.methods.canCreateResume = function () {
  if (this.subscription === "premium") {
    return true;
  }
  return this.resumeCount < 3; // Free users get 3 resume
};

// Check if subscription is active
userSchema.methods.hasActiveSubscription = function () {
  if (this.subscription === "free") return false;
  if (!this.subscriptionExpiry) return false;
  return this.subscriptionExpiry > new Date();
};

module.exports = mongoose.model("User", userSchema);

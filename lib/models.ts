import mongoose from "mongoose"

// User Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  {
    timestamps: true,
  },
)

// GamePlay Schema
const gamePlaySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    gameType: {
      type: String,
      required: true,
      enum: ["number-guessing", "rock-paper-scissors", "tic-tac-toe", "reaction-time"],
    },
    score: {
      type: Number,
      required: true,
    },
    result: {
      type: String,
      required: true,
      enum: ["win", "loss", "tie", "completed"],
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

export const User = mongoose.models.User || mongoose.model("User", userSchema)
export const GamePlay = mongoose.models.GamePlay || mongoose.model("GamePlay", gamePlaySchema)

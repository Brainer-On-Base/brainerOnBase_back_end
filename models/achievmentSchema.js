// models/achievementSchema.js
const mongoose = require("mongoose");

const AchievementSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: String,
  points: { type: Number, default: 0 },
});

module.exports = mongoose.model("Achievement", AchievementSchema);

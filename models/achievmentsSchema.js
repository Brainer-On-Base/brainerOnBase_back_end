const mongoose = require("mongoose");

const AchievementSchema = new mongoose.Schema({
  code: { type: String, required: true }, // identificador único, ej: "first_win"
  name: { type: String, required: true },
  description: String,
  earnedAt: { type: Date, default: Date.now },
  points: { type: Number, default: 0 }, // XP o puntos ganados al desbloquear el logro
  isUnlocked: { type: Boolean, default: false }, // Si el logro ha sido desbloqueado o no
});

module.exports = mongoose.model("Achievment", AchievementSchema);

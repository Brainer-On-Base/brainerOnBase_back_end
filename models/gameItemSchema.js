const mongoose = require("mongoose");

const GameItemSchema = new mongoose.Schema({
  itemId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, default: "" },
  image: { type: String, default: "" },

  slot: {
    type: String,
    enum: [
      "eyes",
      "headgear",
      "mouth",
      "accessory1",
      "accessory2",
      "background",
      "extra",
    ],
    required: true,
  },

  rarity: {
    type: String,
    enum: ["common", "rare", "epic", "legendary"],
    default: "common",
  },

  stats: {
    focusBoost: { type: Number, default: 0 },
    logicBoost: { type: Number, default: 0 },
    creativityBoost: { type: Number, default: 0 },
  },

  maxSupply: { type: Number, required: true },
  mintedSupply: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("GameItem", GameItemSchema);

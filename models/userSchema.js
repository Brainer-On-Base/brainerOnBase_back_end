const mongoose = require("mongoose");
const AchievementSchema = require("./Achievement"); // Ajusta el path según tu estructura

const EquippedSchema = new mongoose.Schema({
  headgear: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GameItem",
    default: null,
  },
  accessory1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GameItem",
    default: null,
  },
  accessory2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GameItem",
    default: null,
  },
  hat: { type: mongoose.Schema.Types.ObjectId, ref: "GameItem", default: null },
  background: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GameItem",
    default: null,
  },
  extra: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GameItem",
    default: null,
  },
});

const InventoryItemSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GameItem",
    required: true,
  },
  equipped: { type: Boolean, default: false },
});

const StatsSchema = new mongoose.Schema({
  brainPower: { type: Number, default: 100 },
  focus: { type: Number, default: 0 },
  memory: { type: Number, default: 0 },
  logic: { type: Number, default: 0 },
  creativity: { type: Number, default: 0 },
  processingSpeed: { type: Number, default: 0 },
});

const UserSchema = new mongoose.Schema({
  wallet: { type: String, required: true, unique: true },
  username: { type: String, required: true },

  level: { type: Number, default: 1 },
  experience: { type: Number, default: 0 },
  experienceToNextLevel: { type: Number, default: 100 },

  stats: { type: StatsSchema, default: () => ({}) },
  inventory: { type: [InventoryItemSchema], default: () => [] },

  mainCharacterNFT: { type: String, default: null },
  brnrBalance: { type: Number, default: 0 },
  tickets: { type: Number, default: 0 },
  achievements: [AchievementSchema], // Logros asociados al usuario

  equippedItems: { type: EquippedSchema, default: () => ({}) },

  joinedAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: null },
});

module.exports = mongoose.model("User", UserSchema);

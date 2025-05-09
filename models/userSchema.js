const mongoose = require("mongoose");

const EquippedSchema = new mongoose.Schema({
  headgear: { type: String, default: null },
  accessory1: { type: String, default: null },
  accessory2: { type: String, default: null },
  hat: { type: String, default: null },
  background: { type: String, default: null },
  extra: { type: String, default: null },
});

const InventoryItemSchema = new mongoose.Schema({
  slot: { type: String, required: true }, // Ej: headgear, accessory, etc.
  itemId: { type: String, required: true }, // ID interno o del NFT
  name: { type: String }, // Nombre visible (opcional)
  rarity: {
    type: String,
    enum: ["common", "rare", "epic", "legendary"],
    default: "common",
  },
  equipped: { type: Boolean, default: false },
  stats: {
    focusBoost: { type: Number, default: 0 },
    logicBoost: { type: Number, default: 0 },
    creativityBoost: { type: Number, default: 0 },
  },
});

const StatsSchema = new mongoose.Schema({
  brainPower: { type: Number, default: 100 },
  focus: { type: Number, default: 20 },
  memory: { type: Number, default: 20 },
  logic: { type: Number, default: 20 },
  creativity: { type: Number, default: 20 },
  processingSpeed: { type: Number, default: 20 },
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
  ownedNFTs: [{ type: String }],
  brnrBalance: { type: Number, default: 0 },
  tickets: { type: Number, default: 0 },
  achievements: [{ type: String }],
  equippedItems: { type: EquippedSchema, default: () => ({}) },
  //   isBanned: { type: Boolean, default: false },
  joinedAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: null },
});

module.exports = mongoose.model("User", UserSchema);

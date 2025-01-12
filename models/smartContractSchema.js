// models/SmartContract.js
const mongoose = require("mongoose");

const SmartContractSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true, unique: true },
  abi: { type: Array, required: true },
  network: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("SmartContract", SmartContractSchema);

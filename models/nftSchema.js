const mongoose = require("mongoose");

const nftSchema = new mongoose.Schema({
  tokenId: { type: Number, required: true, unique: true },
  name: { type: String, default: null },
  image: { type: String, default: null },
  attributes: [
    {
      trait_type: { type: String },
      value: { type: String },
    },
  ],
  metadata: { type: Object, default: {} },
  minted: { type: Boolean, default: false },
});

module.exports = mongoose.model("NFT", nftSchema);

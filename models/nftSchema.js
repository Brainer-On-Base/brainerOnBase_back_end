const mongoose = require("mongoose");

const nftSchema = new mongoose.Schema({
  tokenId: { type: Number, required: true, unique: true },
  name: { type: String, default: null },
  image: { type: String, default: null },
  minted: { type: Boolean, default: false },
  attributes: [
    {
      trait_type: { type: String, required: true },
      value: { type: String, required: true },
    },
  ],
  walletAddress: { type: String, required: true },
});

module.exports = mongoose.model("NFT", nftSchema);

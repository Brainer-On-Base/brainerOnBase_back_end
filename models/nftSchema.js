const mongoose = require("mongoose");

const nftSchema = new mongoose.Schema({
  tokenId: { type: Number, required: true, unique: true },
  name: { type: String, default: null },
  image: { type: String, default: null },
  minted: { type: Boolean, default: false },
  mintedBy: { type: String, default: null },
  tokenURI: { type: String, default: null },
  uriId: { type: Number, default: null, unique: true },
  attributes: [
    {
      trait_type: { type: String, required: true },
      value: { type: String, required: true },
    },
  ],
});

module.exports = mongoose.model("NFT", nftSchema);

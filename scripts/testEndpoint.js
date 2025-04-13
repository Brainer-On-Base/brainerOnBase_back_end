require("dotenv").config();
const mongoose = require("mongoose");
const NFT = require("../models/nftSchema");
const {
  BRAINER_BPC_NFT_MINT_CONTRACT_ADDRESS,
  BRAINER_BPC_NFT_ABI_CONTRACT,
} = require("../config/PBC1_CONFIG");
const { RPC_NODE_URL } = require("../CONSTANTS");
const { ethers } = require("ethers");
const provider = new ethers.JsonRpcProvider(RPC_NODE_URL);
const nftContract = new ethers.Contract(
  BRAINER_BPC_NFT_MINT_CONTRACT_ADDRESS,
  BRAINER_BPC_NFT_ABI_CONTRACT.abi,
  provider
);

(async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/brainerOnBase");
    console.log("✅ Conectado a Mongo");

    const tokenId = 20;
    const walletAddress = await nftContract.ownerOf(tokenId); // chequear el owner real

    const payload = {
      tokenId,
      walletAddress,
      name: "Test Brainer",
      image: "https://example.com/image.png",
      attributes: [
        { trait_type: "hat", value: "Sombrero Brainer" },
        { trait_type: "background", value: "Neon" },
      ],
      metadata: { example: "extra" },
    };

    const ownerOnChain = await nftContract.ownerOf(payload.tokenId);
    if (ownerOnChain.toLowerCase() !== payload.walletAddress.toLowerCase()) {
      throw new Error("❌ La wallet no es dueña del NFT");
    }

    const nft = await NFT.findOneAndUpdate(
      { tokenId: payload.tokenId },
      {
        minted: true,
        name: payload.name,
        image: payload.image,
        attributes: payload.attributes,
        metadata: payload.metadata,
      },
      { upsert: true, new: true }
    );

    console.log("🧠 NFT creado/actualizado:", nft);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
})();

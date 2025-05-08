require("dotenv").config();
const mongoose = require("mongoose");
const NFT = require("../models/nftSchema");
const { DATABASE_URL } = require("../CONSTANTS");

const MONGO_URI = DATABASE_URL;
const TOTAL = 50;

async function connectDB() {
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("✅ Connected to MongoDB");
}

async function createEmptyNFTs() {
  // Limpieza previa opcional
  await NFT.deleteMany({ $or: [{ tokenId: null }, { uriId: null }] });

  for (let i = 0; i < TOTAL; i++) {
    const exists = await NFT.findOne({ tokenId: i });
    if (!exists) {
      await NFT.create({ tokenId: i, uriId: i });
      console.log(`🧠 Created empty NFT ${i}`);
    } else {
      console.log(`⚠️ NFT ${i} already exists`);
    }
  }

  console.log("🎉 Finished creating empty NFTs");
  process.exit(0);
}

(async () => {
  await connectDB();
  await createEmptyNFTs();
})();

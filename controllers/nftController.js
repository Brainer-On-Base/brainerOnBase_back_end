const NFT = require("../models/nftSchema");
const { ethers } = require("ethers");
const {
  BRAINER_BPC_NFT_MINT_CONTRACT_ADDRESS,
  BRAINER_BPC_NFT_ABI_CONTRACT,
} = require("../config/PBC1_CONFIG");
const { RPC_NODE_URL } = require("../CONSTANTS");

const provider = new ethers.JsonRpcProvider(RPC_NODE_URL);
const nftContract = new ethers.Contract(
  BRAINER_BPC_NFT_MINT_CONTRACT_ADDRESS,
  BRAINER_BPC_NFT_ABI_CONTRACT.abi,
  provider
);

exports.getAllNFTs = async (req, res) => {
  try {
    const { page = 1, limit = 50, minted, ...filters } = req.query;
    const query = {};

    if (minted !== undefined) {
      query.minted = minted === "true";
    }

    if (Object.keys(filters).length) {
      query.attributes = {
        $all: Object.entries(filters).map(([trait, value]) => ({
          $elemMatch: { trait_type: trait, value },
        })),
      };
    }

    const total = await NFT.countDocuments(query);
    const nfts = await NFT.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ tokenId: 1 });

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      data: nfts,
    });
  } catch (err) {
    console.error("❌ Error fetching NFTs:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getNFTQuantityMinted = async (req, res) => {
  try {
    const minted = await NFT.countDocuments({ minted: true });
    res.status(200).json({
      success: true,
      minted,
    });
  } catch (err) {
    console.error("❌ Error fetching NFT quantity:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getNFTById = async (req, res) => {
  try {
    const { tokenId } = req.params;
    const nft = await NFT.findOne({ tokenId: tokenId });

    if (!nft) {
      return res.status(404).json({ success: false, message: "NFT not found" });
    }

    res.status(200).json({ success: true, data: nft });
  } catch (err) {
    console.error("❌ Error fetching NFT:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.createOrUpdateNFT = async (req, res) => {
  try {
    const { tokenId, name, image, attributes, metadata, walletAddress } =
      req.body;

    if (!tokenId || !walletAddress) {
      return res.status(400).json({
        success: false,
        message: "tokenId and walletAddress are required",
      });
    }

    const ownerOnChain = await nftContract.ownerOf(tokenId);

    if (ownerOnChain.toLowerCase() !== walletAddress.toLowerCase()) {
      return res.status(403).json({
        success: false,
        message: "Wallet is not the owner of this NFT",
      });
    }

    const nft = await NFT.findOneAndUpdate(
      { tokenId },
      {
        minted: true,
        name,
        image,
        attributes,
        walletAddress,
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true, data: nft });
  } catch (err) {
    console.error("❌ Error saving NFT:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

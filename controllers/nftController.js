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

    // ✅ Asegurarse que sea booleano real
    if (minted !== undefined) {
      query.minted = minted === "true";
    }

    // ✅ Limpiar filtros vacíos o "All"
    const activeFilters = Object.entries(filters).filter(
      ([_, value]) => value && value !== "All" && value.trim() !== ""
    );

    // ✅ Solo si hay filtros reales
    if (activeFilters.length > 0) {
      query.attributes = {
        $all: activeFilters.map(([trait, value]) => ({
          $elemMatch: {
            trait_type: trait,
            value: value.trim(), // limpieza de espacios
          },
        })),
      };
    }

    const total = await NFT.countDocuments(query);
    const nfts = await NFT.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ uriId: 1 });

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      data: nfts,
    });
  } catch (err) {
    console.error("❌ Error fetching NFTs:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Server error", err: err.message });
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
    const { uriId } = req.params;
    const nft = await NFT.findOne({ uriId: uriId });

    if (!nft) {
      return res.status(404).json({ success: false, message: "NFT not found" });
    }

    res.status(200).json({ success: true, data: nft });
  } catch (err) {
    console.error("❌ Error fetching NFT:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.mintNFT = async (req, res) => {
  try {
    const { tokenId, name, image, attributes, mintedBy, tokenURI, uriId } =
      req.body;

    // 1. Buscar si hay conflicto de uriId
    const uriConflict = await NFT.findOne({ uriId });

    // 2. Obtener el documento actual (el que vas a actualizar con ese uriId)
    const currentNFT = await NFT.findOne({ tokenId });
    const previousUriId = currentNFT?.uriId ?? null;

    // 3. Si hay conflicto y no es el mismo tokenId, hay que hacer swap
    if (uriConflict && uriConflict.tokenId !== tokenId) {
      // a. Liberar temporalmente el uriId del que lo tiene actualmente
      await NFT.findByIdAndUpdate(uriConflict._id, { uriId: null });

      // b. Hacer el update con el nuevo uriId (ya libre)
      await NFT.findOneAndUpdate(
        { tokenId },
        {
          minted: true,
          name,
          image,
          attributes,
          mintedBy,
          tokenURI,
          uriId,
        },
        { upsert: true, new: true }
      );

      // c. Asignar el uriId anterior al documento que quedó sin uriId
      await NFT.findByIdAndUpdate(uriConflict._id, { uriId: previousUriId });
    } else {
      // No hay conflicto, actualizar directamente
      await NFT.findOneAndUpdate(
        { tokenId },
        {
          minted: true,
          name,
          image,
          attributes,
          mintedBy,
          tokenURI,
          uriId,
        },
        { upsert: true, new: true }
      );
    }

    const updatedNFT = await NFT.findOne({ tokenId });
    res.status(200).json({ success: true, data: updatedNFT });
  } catch (err) {
    console.error("❌ Error saving NFT:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

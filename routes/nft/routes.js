const express = require("express");
const router = express.Router();
const nftController = require("../../controllers/NftController"); // Controlador de NFTs

router.get("/api/nfts", nftController.getAllNFTs); // Obtener todos los NFTs
router.get("/api/nfts/:id", nftController.getNFTById); // Obtener un NFT específico
router.post("/api/nfts/minted", nftController.createOrUpdateNFT); // Crear o actualizar un NFT

module.exports = router;

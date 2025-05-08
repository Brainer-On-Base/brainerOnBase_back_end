const express = require("express");
const router = express.Router();
const nftController = require("../../controllers/nftController"); // Controlador de NFTs

router.get("/nfts", nftController.getAllNFTs); // Obtener todos los NFTs
router.get("/nfts/minted", nftController.getNFTQuantityMinted); // Obtener la cantidad de NFTs
router.post("/nfts/mint", nftController.mintNFT); // Crear o actualizar un NFT
router.get("/nfts/:uriId", nftController.getNFTById); // Obtener un NFT específico

module.exports = router;

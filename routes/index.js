//ANCHOR - Dependencies
const express = require("express");
const router = express.Router();

//ANCHOR - Imports
const SmartContractController = require("../controllers/smartContractController");
const nftController = require("../controllers/NftController");

//ANCHOR - Module Export
module.exports = function () {
  // AUTH

  // NFTS
  router.get("/api/nfts", nftController.getAllNFTs); // Obtener todos los NFTs
  router.get("/api/nfts/:id", nftController.getNFTById); // Obtener un NFT específico
  router.post("/api/nfts/minted", nftController.createOrUpdateNFT); // Crear o actualizar un NFT

  return router;
};

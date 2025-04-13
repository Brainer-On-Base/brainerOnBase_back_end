//ANCHOR - Dependencies
const express = require("express");
const router = express.Router();

//ANCHOR - Imports
const nftRoutes = require("./nft/routes");

//ANCHOR - Module Export
module.exports = function () {
  // AUTH

  // NFTS
  router.use(nftRoutes);

  return router;
};

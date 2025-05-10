//ANCHOR - Dependencies
const express = require("express");
const router = express.Router();

//ANCHOR - Imports
const nftRoutes = require("./nft/routes");
const userRoutes = require("./user/routes");
const gameItemRoutes = require("./gameItem/routes");

//ANCHOR - Module Export
module.exports = function () {
  router.use(nftRoutes);
  router.use(userRoutes);
  router.use(gameItemRoutes);

  return router;
};

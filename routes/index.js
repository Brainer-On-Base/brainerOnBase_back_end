//ANCHOR - Dependencies
const express = require("express");
const router = express.Router();

//ANCHOR - Imports
const nftRoutes = require("./nft/routes");
const userRoutes = require("./user/routes");
const gameItemRoutes = require("./gameItem/routes");
const achievementRoutes = require("./achievement/routes"); // Import the achievements routes

//ANCHOR - Module Export
module.exports = function () {
  router.use(nftRoutes);
  router.use(userRoutes);
  router.use(gameItemRoutes);
  router.use("/achievements", achievementRoutes); // Add this line to include the achievements routes

  return router;
};

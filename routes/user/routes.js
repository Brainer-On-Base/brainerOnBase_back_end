const express = require("express");
const router = express.Router();
const userController = require("../../controllers/userController"); // Controlador de NFTs

router.post("/user/create", userController.createUser); //Create user
router.get("/user/:wallet", userController.getUserByWallet); //Get user by wallet
router.put("/user/:wallet/add-item", userController.addItemToInventory); //Add item to inventory
router.put("/user/:wallet/equip", userController.equipItem); //Equip item
router.put("/user/transfer-item", userController.transferItem); //Transfer item
router.put("/user/:wallet/update-experience", userController.addExperience); //Update stats
router.put(
  "/user/:wallet/set-main-character",
  userController.setMainCharacterNFT
); //Set main character NFT
router.put("/user/:wallet/update-stats", userController.assignStatPoints); //Update stats
router.put("/user/:wallet/reset-stats", userController.resetStats);
router.put("/user/:wallet/edit", userController.editUser);
router.get("/leaderboard", userController.getTopUsers);
router.get("/user/:wallet/achievements", userController.getAchievements);

module.exports = router;

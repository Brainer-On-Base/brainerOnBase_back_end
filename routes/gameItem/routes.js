const express = require("express");
const router = express.Router();
const gameItemController = require("../controllers/gameItemController");

router.post("/game-item", gameItemController.createGameItem);
router.get("/game-items", gameItemController.getAllGameItems);
router.get("/game-item/:id", gameItemController.getGameItemById);
router.put("/game-item/:id", gameItemController.updateGameItem);
router.delete("/game-item/:id", gameItemController.deleteGameItem);

module.exports = router;

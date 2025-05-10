const express = require("express");
const router = express.Router();
const achievementController = require("../../controllers/achievementController");

router.post("/achievement", achievementController.createAchievement);
router.get("/achievements", achievementController.getAllAchievements);
router.get("/achievement/:id", achievementController.getAchievementById);
router.put("/achievement/:id", achievementController.updateAchievement);
router.delete("/achievement/:id", achievementController.deleteAchievement);

module.exports = router;

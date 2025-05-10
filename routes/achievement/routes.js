const express = require("express");
const router = express.Router();
const controller = require("../controllers/achievementController");

router.post("/achievement", controller.createAchievement);
router.get("/achievements", controller.getAllAchievements);
router.get("/achievement/:id", controller.getAchievementById);
router.put("/achievement/:id", controller.updateAchievement);
router.delete("/achievement/:id", controller.deleteAchievement);

module.exports = router;

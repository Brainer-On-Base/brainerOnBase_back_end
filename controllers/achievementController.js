const Achievement = require("../models/achievmentSchema");

// CREATE
const createAchievement = async (req, res) => {
  try {
    const achievement = new Achievement(req.body);
    await achievement.save();
    res.status(201).json({ success: true, achievement });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: "Error creating achievement",
      message: err.message,
    });
  }
};

// READ ALL with filters + pagination
const getAllAchievements = async (req, res) => {
  try {
    const { code, name, isUnlocked, limit = 20, offset = 0 } = req.query;

    const filters = {};
    if (code) filters.code = code;
    if (name) filters.name = { $regex: new RegExp(name, "i") };
    if (isUnlocked !== undefined) filters.isUnlocked = isUnlocked === "true";

    const parsedLimit = parseInt(limit, 10);
    const parsedOffset = parseInt(offset, 10);

    const [achievements, total] = await Promise.all([
      Achievement.find(filters).skip(parsedOffset).limit(parsedLimit),
      Achievement.countDocuments(filters),
    ]);

    res.json({
      success: true,
      achievements,
      pagination: {
        total,
        limit: parsedLimit,
        offset: parsedOffset,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Error fetching achievements",
      message: err.message,
    });
  }
};

// READ ONE
const getAchievementById = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    if (!achievement)
      return res
        .status(404)
        .json({ success: false, error: "Achievement not found" });

    res.json({ success: true, achievement });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Error fetching achievement",
      message: err.message,
    });
  }
};

// UPDATE
const updateAchievement = async (req, res) => {
  try {
    const updated = await Achievement.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updated)
      return res
        .status(404)
        .json({ success: false, error: "Achievement not found" });

    res.json({ success: true, achievement: updated });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: "Error updating achievement",
      message: err.message,
    });
  }
};

// DELETE
const deleteAchievement = async (req, res) => {
  try {
    const deleted = await Achievement.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res
        .status(404)
        .json({ success: false, error: "Achievement not found" });

    res.json({ success: true, message: "Achievement deleted" });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Error deleting achievement",
      message: err.message,
    });
  }
};

module.exports = {
  createAchievement,
  getAllAchievements,
  getAchievementById,
  updateAchievement,
  deleteAchievement,
};

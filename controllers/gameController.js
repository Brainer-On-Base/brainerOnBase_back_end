const GameItem = require("../models/GameItem");

// CREATE
const createGameItem = async (req, res) => {
  try {
    const gameItem = new GameItem(req.body);
    await gameItem.save();
    res.status(201).json({ success: true, item: gameItem });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: "Error creating game item",
      message: err.message,
    });
  }
};

// READ ALL
const getAllGameItems = async (req, res) => {
  try {
    const { rarity, slot, name, itemId, limit = 20, offset = 0 } = req.query;

    const filters = {};
    if (rarity) filters.rarity = rarity;
    if (slot) filters.slot = slot;
    if (name) filters.name = { $regex: new RegExp(name, "i") };
    if (itemId) filters.itemId = itemId;

    const parsedLimit = parseInt(limit, 10);
    const parsedOffset = parseInt(offset, 10);

    const [items, total] = await Promise.all([
      GameItem.find(filters).skip(parsedOffset).limit(parsedLimit),
      GameItem.countDocuments(filters),
    ]);

    res.json({
      success: true,
      items,
      pagination: {
        total,
        limit: parsedLimit,
        offset: parsedOffset,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Error fetching game items",
      message: err.message,
    });
  }
};

// READ ONE
const getGameItemById = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await GameItem.findById(id);
    if (!item)
      return res.status(404).json({ success: false, error: "Item not found" });
    res.json({ success: true, item });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Error fetching game item",
      message: err.message,
    });
  }
};

// UPDATE
const updateGameItem = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedItem = await GameItem.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedItem)
      return res.status(404).json({ success: false, error: "Item not found" });

    res.json({ success: true, item: updatedItem });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: "Error updating game item",
      message: err.message,
    });
  }
};

// DELETE
const deleteGameItem = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedItem = await GameItem.findByIdAndDelete(id);
    if (!deletedItem)
      return res.status(404).json({ success: false, error: "Item not found" });

    res.json({ success: true, message: "Item deleted" });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Error deleting game item",
      message: err.message,
    });
  }
};

module.exports = {
  createGameItem,
  getAllGameItems,
  getGameItemById,
  updateGameItem,
  deleteGameItem,
};

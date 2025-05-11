const User = require("../models/userSchema");

const createUser = async (req, res) => {
  const { wallet, username } = req.body;
  try {
    let existing = await User.findOne({ wallet });
    if (existing) return res.status(200).json(existing);

    const newUser = await User.create({ wallet, username });
    res.status(201).json({
      newUser,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error creating user",
      error: err.message,
      success: false,
    });
  }
};

const editUser = async (req, res) => {
  const { wallet } = req.params;
  const { username, mainCharacterNFT } = req.body;

  // Solo incluir campos definidos
  const updates = {};
  if (username !== undefined) updates.username = username;
  if (mainCharacterNFT !== undefined)
    updates.mainCharacterNFT = mainCharacterNFT;

  try {
    const user = await User.findOneAndUpdate({ wallet }, updates, {
      new: true,
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
        success: false,
      });
    }

    res.json({
      message: "User updated successfully",
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      error: "Error updating user",
      message: err.message,
      success: false,
    });
  }
};

const getUserByWallet = async (req, res) => {
  const { wallet } = req.params;
  try {
    const user = await User.findOne({ wallet });
    if (!user)
      return res.status(404).json({
        error: "User not found",
        success: false,
      });
    res.json({
      user,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      error: "Error retrieving user",
      message: err.message,
      success: false,
    });
  }
};

const addItemToInventory = async (req, res) => {
  const { wallet } = req.params;
  const newItem = req.body; // debe contener itemId, slot, etc.

  try {
    const user = await User.findOne({ wallet });
    if (!user)
      return res.status(404).json({
        error: "Usuario no encontrado",
        success: false,
      });

    user.inventory.push(newItem);
    await user.save();
    res.json({
      message: "Item added successfully",
      inventory: user.inventory,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      error: "Error adding item to inventory",
      message: err.message,
      success: false,
    });
  }
};

const equipItem = async (req, res) => {
  const { wallet } = req.params;
  const { itemId } = req.body;

  try {
    const user = await User.findOne({ wallet });
    if (!user)
      return res.status(404).json({
        message: "User not found",
        success: false,
      });

    const item = user.inventory.find((i) => i.itemId === itemId);
    if (!item)
      return res
        .status(404)
        .json({ message: "Item not found", success: false });

    // Unequip otros del mismo slot
    user.inventory.forEach((i) => {
      if (i.slot === item.slot) i.equipped = false;
    });

    item.equipped = true;
    user.equippedItems[item.slot] = item.itemId;

    await user.save();
    res.json({
      message: `Ítem ${itemId} equipado`,
      equippedItems: user.equippedItems,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      error: "Error equipping item",
      message: err.message,
      success: false,
    });
  }
};

const transferItem = async (req, res) => {
  const { fromWallet, toWallet, itemId } = req.body;

  try {
    const sender = await User.findOne({ wallet: fromWallet });
    const receiver = await User.findOne({ wallet: toWallet });
    if (!sender || !receiver)
      return res.status(404).json({
        error: "Users not found",
        success: false,
      });

    const itemIndex = sender.inventory.findIndex((i) => i.itemId === itemId);
    if (itemIndex === -1)
      return res.status(404).json({
        error: "Item not found in sender's inventory",
        success: false,
      });

    const item = sender.inventory[itemIndex];
    sender.inventory.splice(itemIndex, 1); // remove item
    receiver.inventory.push(item); // add to receiver

    await sender.save();
    await receiver.save();

    res.json({ message: "Item transferred successfully", success: true });
  } catch (err) {
    res.status(500).json({
      error: "Error transferring item",
      message: err.message,
      success: false,
    });
  }
};

const setMainCharacterNFT = async (req, res) => {
  const { wallet } = req.params;
  const { nftId } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { wallet },
      { mainCharacterNFT: nftId },
      { new: true }
    );
    if (!user)
      return res.status(404).json({
        error: "User not found",
        success: false,
      });
    res.json(user);
  } catch (err) {
    res.status(500).json({
      error: "Error setting main character NFT",
      message: err.message,
      success: false,
    });
  }
};

const addExperience = async (req, res) => {
  const { wallet } = req.params;
  const { xpGained } = req.body;

  try {
    const user = await User.findOne({ wallet });
    if (!user)
      return res.status(404).json({
        error: "User not found",
        success: false,
      });

    user.experience += xpGained;

    while (user.experience >= user.experienceToNextLevel) {
      user.experience -= user.experienceToNextLevel;
      user.level += 1;
      user.experienceToNextLevel = Math.floor(user.experienceToNextLevel * 1.2);
      user.stats.brainPower += 5; // o cualquier valor de mejora por nivel
    }

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({
      error: "Error adding experience",
      message: err.message,
      success: false,
    });
  }
};

const assignStatPoints = async (req, res) => {
  const { wallet } = req.params;
  const {
    focus = 0,
    logic = 0,
    creativity = 0,
    memory = 0,
    processingSpeed = 0,
  } = req.body;

  const totalPoints = focus + logic + creativity + memory + processingSpeed;

  try {
    const user = await User.findOne({ wallet });
    if (!user)
      return res.status(404).json({
        error: "User not found",
        success: false,
      });

    if (totalPoints > user.stats.brainPower) {
      return res.status(400).json({
        error: "Not enough brainPower to assign these stats",
        success: false,
      });
    }

    user.stats.focus += focus;
    user.stats.logic += logic;
    user.stats.creativity += creativity;
    user.stats.memory += memory;
    user.stats.processingSpeed += processingSpeed;
    user.stats.brainPower -= totalPoints;

    await user.save();
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({
      error: "Error assigning stat points",
      message: err.message,
      success: false,
    });
  }
};

const resetStats = async (req, res) => {
  const { wallet } = req.params;

  try {
    const user = await User.findOne({ wallet });
    if (!user)
      return res.status(404).json({
        error: "User not found",
        success: false,
      });

    const totalAssignedPoints =
      user.stats.focus +
      user.stats.logic +
      user.stats.creativity +
      user.stats.memory +
      user.stats.processingSpeed;

    user.stats.brainPower += totalAssignedPoints;
    user.stats.focus = 0;
    user.stats.logic = 0;
    user.stats.creativity = 0;
    user.stats.memory = 0;
    user.stats.processingSpeed = 0;

    await user.save();
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({
      error: "Error resetting stats",
      message: err.message,
      success: false,
    });
  }
};

const getTopUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .sort({ "stats.level": -1 })
      .limit(10)
      .select("wallet stats.level stats.experience username");

    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({
      error: "Error fetching leaderboard",
      message: err.message,
      success: false,
    });
  }
};

const getAchievements = async (req, res) => {
  const { wallet } = req.params;

  try {
    const user = await User.findOne({ wallet }).select("achievements");
    if (!user)
      return res.status(404).json({
        error: "User not found",
        success: false,
      });

    res.json({ success: true, achievements: user.achievements });
  } catch (err) {
    res.status(500).json({
      error: "Error fetching achievements",
      message: err.message,
      success: false,
    });
  }
};

module.exports = {
  createUser,
  getUserByWallet,
  addItemToInventory,
  equipItem,
  transferItem,
  setMainCharacterNFT,
  addExperience,
  assignStatPoints,
  resetStats,
  getTopUsers,
  getAchievements,
  editUser,
};

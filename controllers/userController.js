const User = require("../models/User");

// Crear un nuevo usuario (si no existe)
const createUser = async (req, res) => {
  const { wallet, username } = req.body;
  try {
    let existing = await User.findOne({ wallet });
    if (existing) return res.status(200).json(existing);

    const newUser = await User.create({ wallet, username });
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: "Error al crear usuario" });
  }
};

// Obtener usuario por wallet
const getUserByWallet = async (req, res) => {
  const { wallet } = req.params;
  try {
    const user = await User.findOne({ wallet });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Error al buscar usuario" });
  }
};

// Agregar ítem al inventario
const addItemToInventory = async (req, res) => {
  const { wallet } = req.params;
  const newItem = req.body; // debe contener itemId, slot, etc.

  try {
    const user = await User.findOne({ wallet });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    user.inventory.push(newItem);
    await user.save();
    res.json({ message: "Ítem agregado", inventory: user.inventory });
  } catch (err) {
    res.status(500).json({ error: "Error al agregar ítem" });
  }
};

// Equipar ítem (y actualizar equippedItems)
const equipItem = async (req, res) => {
  const { wallet } = req.params;
  const { itemId } = req.body;

  try {
    const user = await User.findOne({ wallet });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const item = user.inventory.find((i) => i.itemId === itemId);
    if (!item) return res.status(404).json({ error: "Ítem no encontrado" });

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
    });
  } catch (err) {
    res.status(500).json({ error: "Error al equipar ítem" });
  }
};

// Transferir ítem de un jugador a otro
const transferItem = async (req, res) => {
  const { fromWallet, toWallet, itemId } = req.body;

  try {
    const sender = await User.findOne({ wallet: fromWallet });
    const receiver = await User.findOne({ wallet: toWallet });
    if (!sender || !receiver)
      return res.status(404).json({ error: "Usuarios no encontrados" });

    const itemIndex = sender.inventory.findIndex((i) => i.itemId === itemId);
    if (itemIndex === -1)
      return res.status(404).json({ error: "Ítem no encontrado" });

    const item = sender.inventory[itemIndex];
    sender.inventory.splice(itemIndex, 1); // remove item
    receiver.inventory.push(item); // add to receiver

    await sender.save();
    await receiver.save();

    res.json({ message: "Ítem transferido con éxito" });
  } catch (err) {
    res.status(500).json({ error: "Error en la transferencia" });
  }
};

module.exports = {
  createUser,
  getUserByWallet,
  addItemToInventory,
  equipItem,
  transferItem,
};

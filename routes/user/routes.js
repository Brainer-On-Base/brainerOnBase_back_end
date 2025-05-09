const express = require("express");
const router = express.Router();
const userController = require("../../controllers/userController"); // Controlador de NFTs

// Crear usuario
router.post("/create", userController.createUser);

// Obtener usuario por wallet
router.get("/:wallet", userController.getUserByWallet);

// Agregar ítem al inventario
router.post("/:wallet/add-item", userController.addItemToInventory);

// Equipar ítem
router.post("/:wallet/equip", userController.equipItem);

// Transferir ítem de un usuario a otro
router.post("/transfer-item", userController.transferItem);

module.exports = router;

const express = require("express");
const router = express.Router();
const userController = require("../../controllers/userController"); // Controlador de NFTs

// Crear usuario
router.post("/user/create", userController.createUser);

// Obtener usuario por wallet
router.get("/user/:wallet", userController.getUserByWallet);

// Agregar ítem al inventario
router.post("/user/:wallet/add-item", userController.addItemToInventory);

// Equipar ítem
router.post("/user/:wallet/equip", userController.equipItem);

// Transferir ítem de un usuario a otro
router.post("/user/transfer-item", userController.transferItem);

module.exports = router;

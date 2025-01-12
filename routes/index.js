//ANCHOR - Dependencies
const express = require("express");
const router = express.Router();

//ANCHOR - Imports
const SmartContractController = require("../controllers/SmartContractController");

//ANCHOR - Module Export
module.exports = function () {
  // AUTH

  // SMART CONTRACTS
  router.get("/api/contracts", SmartContractController.getAllContracts); // Obtener todos los contratos
  router.get("/api/contracts/:id", SmartContractController.getContractById); // Obtener un contrato específico
  router.post("/api/contracts", SmartContractController.addContract); // Agregar un nuevo contrato
  router.put("/api/contracts/:id", SmartContractController.updateContract); // Actualizar un contrato
  router.delete("/api/contracts/:id", SmartContractController.deleteContract); // Eliminar un contrato

  return router;
};

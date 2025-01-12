const SmartContract = require("../models/smartContractSchema"); // Modelo de la base de datos

// Obtener todos los contratos
async function getAllContracts(req, res) {
  try {
    const contracts = await SmartContract.find();
    res.status(200).json(contracts);
  } catch (err) {
    res.status(500).json({ error: "Error fetching contracts", details: err });
  }
}

// Obtener un contrato específico
async function getContractById(req, res) {
  try {
    const contract = await SmartContract.findById(req.params.id);
    if (!contract) {
      return res.status(404).json({ error: "Contract not found" });
    }
    res.status(200).json(contract);
  } catch (err) {
    res.status(500).json({ error: "Error fetching contract", details: err });
  }
}

// Agregar un nuevo contrato
async function addContract(req, res) {
  try {
    const { name, address, abi, network } = req.body;
    const newContract = new SmartContract({ name, address, abi, network });
    await newContract.save();
    res
      .status(201)
      .json({ message: "Contract created successfully", newContract });
  } catch (err) {
    res.status(500).json({ error: "Error adding contract", details: err });
  }
}

// Actualizar un contrato existente
async function updateContract(req, res) {
  try {
    const { name, address, abi, network } = req.body;
    const updatedContract = await SmartContract.findByIdAndUpdate(
      req.params.id,
      { name, address, abi, network },
      { new: true }
    );
    if (!updatedContract) {
      return res.status(404).json({ error: "Contract not found" });
    }
    res
      .status(200)
      .json({ message: "Contract updated successfully", updatedContract });
  } catch (err) {
    res.status(500).json({ error: "Error updating contract", details: err });
  }
}

// Eliminar un contrato
async function deleteContract(req, res) {
  try {
    const deletedContract = await SmartContract.findByIdAndDelete(
      req.params.id
    );
    if (!deletedContract) {
      return res.status(404).json({ error: "Contract not found" });
    }
    res
      .status(200)
      .json({ message: "Contract deleted successfully", deletedContract });
  } catch (err) {
    res.status(500).json({ error: "Error deleting contract", details: err });
  }
}

//ANCHOR - Module Export
module.exports = {
  getAllContracts,
  getContractById,
  addContract,
  updateContract,
  deleteContract,
};

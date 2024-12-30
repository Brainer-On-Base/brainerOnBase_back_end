const { ethers } = require("hardhat");

async function main() {
    const PixelBrainerCollection = await ethers.getContractFactory("PixelBrainerCollection");
  
    // Define el maxSupply del contrato
    const maxSupply = 100;
    // Despliega el contrato con el maxSupply especificado
    const contract = await PixelBrainerCollection.deploy(maxSupply);
    console.log("YOUR CONTRACT", contract);
    // Espera a que la transacción de despliegue se confirme
    // await contract.deployTransaction.wait();
  
    // console.log("Contract deployed to address:", contract.address);
}
  
main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });

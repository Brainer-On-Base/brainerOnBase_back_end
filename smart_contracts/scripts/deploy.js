const { ethers } = require("hardhat");

async function deploy() {
  // Obtienes la fábrica del contrato
  const PixelBrainerCollection = await ethers.getContractFactory(
    "PixelBrainerNFTCollection"
  );

  // Parámetros para el constructor (personalízalos según tu caso)
  const maxSupply = 10; // Número total de NFTs
  const mintPrice = ethers.parseEther("0.001"); // Precio del mint en Ether
  const transferFeePercentage = 5; // Porcentaje de fee de transferencia

  // Array de URIs para inicializar
  const initial_uris = Array.from(
    { length: maxSupply },
    (_, i) =>
      `https://braineronbase.com/ipfs/QmeBaKmJaqx3i1T8cBBaTT1k84wYVvncTHpXL2LVN84sW4/${i}.json`
  );
  console.log("URIs iniciales:", initial_uris);
  // Despliegas el contrato con los parámetros necesarios
  const contract = await PixelBrainerCollection.deploy(
    maxSupply,
    mintPrice,
    transferFeePercentage,
    initial_uris
  );

  console.log("Contrato desplegado en:", contract);
}

// Ejecuta la función de despliegue
deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

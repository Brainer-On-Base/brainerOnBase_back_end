const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  const balance = await deployer.provider.getBalance(deployer.address);

  console.log(
    "Deploying PixelBrainerNFTCollection with account:",
    deployer.address
  );
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  const PixelBrainerCollection = await ethers.getContractFactory(
    "PixelBrainerNFTCollection"
  );

  const maxSupply = 50;
  const mintPrice = ethers.parseEther("0.001"); // 0.001 ETH
  const transferFeePercentage = 0;

  const initial_uris = Array.from(
    { length: maxSupply },
    (_, i) =>
      `https://braineronbase.com/ipfs/QmeBaKmJaqx3i1T8cBBaTT1k84wYVvncTHpXL2LVN84sW4/${i}.json`
  );

  console.log("URIs iniciales:", initial_uris);

  const pixelBrainer = await PixelBrainerCollection.deploy(
    maxSupply,
    mintPrice,
    transferFeePercentage,
    initial_uris
  );

  await pixelBrainer.waitForDeployment();

  console.log("✅ PixelBrainerNFTCollection deployed at:", pixelBrainer.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });

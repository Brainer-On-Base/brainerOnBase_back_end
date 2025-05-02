const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  const balance = await deployer.provider.getBalance(deployer.address);

  console.log("🚀 Deploying with account:", deployer.address);
  console.log("💰 Balance:", ethers.formatEther(balance), "ETH");

  const PixelBrainerCollection = await ethers.getContractFactory(
    "PixelBrainerNFTCollection"
  );

  const maxSupply = 50;
  const mintPrice = ethers.parseEther("0.001"); // 0.001 ETH
  const baseURI =
    "https://braineronbase.com/ipfs/QmeBaKmJaqx3i1T8cBBaTT1k84wYVvncTHpXL2LVN84sW4/";

  const pixelBrainer = await PixelBrainerCollection.deploy(
    maxSupply,
    mintPrice,
    baseURI
  );

  await pixelBrainer.waitForDeployment();

  console.log("✅ Contract deployed at:", pixelBrainer.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });

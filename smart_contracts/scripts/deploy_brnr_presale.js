const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying BrainerPreSale with account:", deployer.address);
  console.log(
    "Account balance:",
    ethers.utils.formatEther(await deployer.getBalance()),
    "ETH"
  );

  const tokenAddress = "0x373ED1C41e5327a7aE07F7Ac50a6f1D1A73089DE";

  const BrainerPreSale = await ethers.getContractFactory("BrainerPreSale");
  const preSale = await BrainerPreSale.deploy(tokenAddress);

  await preSale.deployed();

  console.log("✅ BrainerPreSale deployed at:", preSale.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });

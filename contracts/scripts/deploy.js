const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const token = await hre.ethers.deployContract("ZakatToken", ["Zakat", "ZAKAT", deployer.address]);

  await token.waitForDeployment();

  console.log(
    `Token deployed to ${token.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

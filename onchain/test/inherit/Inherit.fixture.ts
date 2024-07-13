import type { InheritanceManager, TokenERC20 } from "../../types";
import hre from "hardhat";

export async function deployInheritFixture(): Promise<{
  inheritanceManager: InheritanceManager;
  tokenERC20: TokenERC20;
}> {
  const accounts = await hre.ethers.getSigners();
  const contractOwner = accounts[0];

  const inheritanceManagerFactory = await hre.ethers.getContractFactory("InheritanceManager");
  const inheritanceManager = await inheritanceManagerFactory.connect(contractOwner).deploy();
  await inheritanceManager.waitForDeployment();

  const tokenERC20Factory = await hre.ethers.getContractFactory("TokenERC20");
  const tokenERC20 = await tokenERC20Factory.connect(contractOwner).deploy("Codroipo", "MOS");
  await tokenERC20.waitForDeployment();
  
  return { inheritanceManager, tokenERC20 };
}

export async function getTokensFromFaucet() {
  if (hre.network.name === "localfhenix") {
    const signers = await hre.ethers.getSigners();

    if (
      (await hre.ethers.provider.getBalance(signers[0].address)).toString() ===
      "0"
    ) {
      await hre.fhenixjs.getFunds(signers[0].address);
    }
  }
}

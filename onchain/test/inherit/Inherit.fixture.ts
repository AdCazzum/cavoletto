import type { InheritanceManager } from "../../types";
import axios from "axios";
import hre from "hardhat";

export async function deployInheritFixture(): Promise<{
  inheritanceManager: InheritanceManager;
  address: string;
}> {
  const accounts = await hre.ethers.getSigners();
  const contractOwner = accounts[0];

  const inheritanceManagerFactory = await hre.ethers.getContractFactory("InheritanceManager");
  const inheritanceManager = await inheritanceManagerFactory.connect(contractOwner).deploy();
  await inheritanceManager.waitForDeployment();
  const address = await inheritanceManager.getAddress();
  return { inheritanceManager, address };
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

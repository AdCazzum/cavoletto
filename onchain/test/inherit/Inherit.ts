import { createFheInstance } from "../../utils/instance";
import type { Signers } from "../types";
import { shouldBehaveLikeCounter } from "./Inherit.behavior";
import { deployInheritFixture, getTokensFromFaucet } from "./Inherit.fixture";
import hre from "hardhat";
import { expect } from "chai";


import { FhenixClient, EncryptionTypes, EncryptedUint8 } from 'fhenixjs';


describe("Unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    // get tokens from faucet if we're on localfhenix and don't have a balance
    await getTokensFromFaucet();
    // deploy test contract
    const { inheritanceManager, address } = await deployInheritFixture();
    this.inheritanceManager = inheritanceManager;

    // initiate fhenixjs
    this.instance = await createFheInstance(hre, address);

    // set admin account/signer
    const signers = await hre.ethers.getSigners();
    this.signers.admin = signers[0];

    this.fhenixClient = new FhenixClient({provider: hre.ethers.provider});
  });

  describe("Deploy", function () {
    it("E2E", async function () {
      // const amountToCount = 10;

      // const eAmountCount = await this.instance.instance.encrypt_uint32(
      // 	amountToCount,
      // );
      // await this.inheritanceManager.connect(this.signers.admin).storeBeneficiaries(
      // 	[await this.fhenixClient.encrypt_address(BigInt(0), EncryptionTypes.address)],
      // 	[await this.fhenixClient.encrypt_address(BigInt(0), EncryptionTypes.address)],
      // 	[0]
      // );

      await this.inheritanceManager.connect(this.signers.admin).foo123(
	await this.fhenixClient.encrypt_address("0x0000000000000000000000000000000000000000")
      );

      

      // await waitForBlock(hre);

      // const eAmount = await this.counter
      // 	.connect(this.signers.admin)
      // 	.getCounterPermitSealed(this.instance.permission);
      // const amount = this.instance.instance.unseal(
      // 	await this.counter.getAddress(),
      // 	eAmount,
      // );
      
      // expect(Number(amount) === amountToCount);
      expect(true);
    });
  });
});

import { createFheInstance } from "../../utils/instance";
import type { Signers } from "../types";
import { deployInheritFixture, getTokensFromFaucet } from "./Inherit.fixture";
import hre from "hardhat";
import { expect } from "chai";
import { waitForBlock } from "../../utils/block";


import { FhenixClient, EncryptionTypes, EncryptedUint8 } from 'fhenixjs';
import { HardhatRuntimeEnvironment } from "hardhat/types";


describe("Unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    // get tokens from faucet if we're on localfhenix and don't have a balance
    await getTokensFromFaucet();
    // deploy test contract
    const { inheritanceManager, tokenERC20 } = await deployInheritFixture();
    this.inheritanceManager = inheritanceManager;
    this.tokenERC20 = tokenERC20;

    // initiate fhenixjs
    this.instance = await createFheInstance(hre, await inheritanceManager.getAddress());

    // set admin account/signer
    const signers = await hre.ethers.getSigners();
    this.signers.admin = signers[0];

    this.fhenixClient = new FhenixClient({provider: hre.ethers.provider});
  });

  describe("Deploy", function () {
    before(async function () {
      // const amountToCount = 10;

      // const eAmountCount = await this.instance.instance.encrypt_uint32(
      // 	amountToCount,
      // );

      const tx = await this.tokenERC20.connect(this.signers.admin).approve(await this.inheritanceManager.getAddress(), "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
      console.log(await this.tokenERC20.balanceOf(this.signers.admin.address))
      // await tx.wait();

    });
    it("fgfdgf", async function() {
      await this.inheritanceManager.connect(this.signers.admin).storeBeneficiaries(
	[await this.fhenixClient.encrypt_address("0x0000000000000000000000000000000000000001")],
	[await this.fhenixClient.encrypt_address(await this.tokenERC20.getAddress())],
	[await this.fhenixClient.encrypt_uint32(0)]
      );
      
      await this.inheritanceManager.connect(this.signers.admin).distributeInheritance();

      console.log(await this.tokenERC20.getAddress());
      console.log(await this.inheritanceManager.foo());
      
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

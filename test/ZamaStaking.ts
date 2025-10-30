import { expect } from "chai";
import { ethers, fhevm } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { FhevmType } from "@fhevm/hardhat-plugin";

import { ERC7984USDT, ERC7984Zama, ZamaStaking } from "../types";

const STAKE_AMOUNT = 2_000n * 1_000_000n; // 2000 cUSDT with 6 decimals
const REWARD_SUPPLY = 1_000_000n * 1_000_000n;

describe("ZamaStaking", function () {
  let deployer: HardhatEthersSigner;
  let alice: HardhatEthersSigner;
  let cUsdt: ERC7984USDT;
  let cZama: ERC7984Zama;
  let staking: ZamaStaking;

  beforeEach(async function () {
    if (!fhevm.isMock) {
      this.skip();
    }

    [deployer, alice] = await ethers.getSigners();

    const cUsdtFactory = await ethers.getContractFactory("ERC7984USDT");
    cUsdt = (await cUsdtFactory.deploy()) as ERC7984USDT;

    const cZamaFactory = await ethers.getContractFactory("ERC7984Zama");
    cZama = (await cZamaFactory.deploy()) as ERC7984Zama;

    const stakingFactory = await ethers.getContractFactory("ZamaStaking");
    staking = (await stakingFactory.deploy(
      await cUsdt.getAddress(),
      await cZama.getAddress()
    )) as ZamaStaking;

    await cZama.mint(await staking.getAddress(), REWARD_SUPPLY);
    await cUsdt.mint(alice.address, STAKE_AMOUNT);
  });

  it("allows staking, accrues rewards, and supports claiming", async function () {
    const stakingAddress = await staking.getAddress();
    const block = await ethers.provider.getBlock("latest");
    const expiry = block!.timestamp + 3600;

    await cUsdt.connect(alice).setOperator(stakingAddress, expiry);

    await staking.connect(alice).stake(STAKE_AMOUNT);

    expect(await staking.stakedBalance(alice.address)).to.equal(STAKE_AMOUNT);

    await ethers.provider.send("evm_increaseTime", [86400]);
    await ethers.provider.send("evm_mine", []);

    const pendingBeforeClaim = await staking.pendingReward(alice.address);
    expect(pendingBeforeClaim).to.equal(STAKE_AMOUNT / 1000n);

    await staking.connect(alice).claimReward();

    const pendingAfterClaim = await staking.pendingReward(alice.address);
    expect(pendingAfterClaim).to.equal(0n);

    const rewardBalanceEncrypted = await cZama.confidentialBalanceOf(alice.address);
    const rewardTokenAddress = await cZama.getAddress();
    const clearRewardBalance = await fhevm.userDecryptEuint(
      FhevmType.euint64,
      rewardBalanceEncrypted,
      rewardTokenAddress,
      alice
    );
    const expectedReward = STAKE_AMOUNT / 1000n;
    const rewardDifference = (() => {
      const rewardBigInt = BigInt(clearRewardBalance);
      return rewardBigInt >= expectedReward ? rewardBigInt - expectedReward : expectedReward - rewardBigInt;
    })();
    expect(Number(rewardDifference)).to.be.lte(10_000);

    await staking.connect(alice).unstake(STAKE_AMOUNT);

    expect(await staking.stakedBalance(alice.address)).to.equal(0n);

    const stakerBalanceEncrypted = await cUsdt.confidentialBalanceOf(alice.address);
    const stakingTokenAddress = await cUsdt.getAddress();
    const clearStakeBalance = await fhevm.userDecryptEuint(
      FhevmType.euint64,
      stakerBalanceEncrypted,
      stakingTokenAddress,
      alice
    );
    expect(BigInt(clearStakeBalance)).to.equal(STAKE_AMOUNT);
  });
});

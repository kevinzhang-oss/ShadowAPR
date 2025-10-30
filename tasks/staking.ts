import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

task("staking:addresses", "Print deployed token and staking addresses").setAction(
  async (_taskArguments: TaskArguments, hre) => {
    const { deployments } = hre;

    const usdt = await deployments.get("ERC7984USDT");
    const zama = await deployments.get("ERC7984Zama");
    const staking = await deployments.get("ZamaStaking");

    console.log(`cUSDT address      : ${usdt.address}`);
    console.log(`cZAMA address      : ${zama.address}`);
    console.log(`ZamaStaking address: ${staking.address}`);
  }
);

task("staking:user-info", "Display staking and reward information for an account")
  .addOptionalParam("account", "Account address to inspect")
  .setAction(async (taskArguments: TaskArguments, hre) => {
    const { ethers, deployments } = hre;

    const stakingDeployment = await deployments.get("ZamaStaking");
    const stakingContract = await ethers.getContractAt("ZamaStaking", stakingDeployment.address);

    const targetAccount =
      taskArguments.account ?? (await ethers.getSigners())[0]?.address ?? ethers.ZeroAddress;

    const [staked, pending] = await Promise.all([
      stakingContract.stakedBalance(targetAccount),
      stakingContract.pendingReward(targetAccount),
    ]);

    console.log(`Account: ${targetAccount}`);
    console.log(`Staked : ${staked.toString()}`);
    console.log(`Pending: ${pending.toString()}`);
  });

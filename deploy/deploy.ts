import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const INITIAL_REWARD_SUPPLY = 1_000_000n * 10n ** 6n;

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { ethers, deployments, getNamedAccounts } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const usdt = await deploy("ERC7984USDT", {
    from: deployer,
    log: true,
  });

  const zama = await deploy("ERC7984Zama", {
    from: deployer,
    log: true,
  });

  const staking = await deploy("ShadowAPR", {
    from: deployer,
    args: [usdt.address, zama.address],
    log: true,
  });

  const zamaContract = await ethers.getContractAt("ERC7984Zama", zama.address);

  if (hre.network.name === "hardhat" || hre.network.name === "localhost" || hre.network.name === "anvil") {
    log("Skipping reward funding on local network");
  } else {
    const currentBalance = await zamaContract.confidentialBalanceOf(staking.address);
    if (currentBalance === ethers.ZeroHash) {
      const mintTx = await zamaContract.mint(staking.address, INITIAL_REWARD_SUPPLY);
      await mintTx.wait();
      log(`Minted ${INITIAL_REWARD_SUPPLY.toString()} cZAMA to staking contract`);
    } else {
      log("Staking contract already funded with cZAMA");
    }
  }

  log(`cUSDT deployed at ${usdt.address}`);
  log(`cZAMA deployed at ${zama.address}`);
  log(`ZamaStaking deployed at ${staking.address}`);
};

export default func;
func.id = "deploy_zama_staking";
func.tags = ["staking", "tokens"];

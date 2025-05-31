import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployRoulette: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  console.log("🚀 Deploying Roulette with account:", deployer);

  const deployResult = await deploy("Roulette", {
    from: deployer,
    args: [], // Конструктор без аргументов
    log: true,
    autoMine: true,
  });

  console.log("🎰 Roulette deployed to:", deployResult.address);
  console.log("🔗 Network:", hre.network.name);
  
  // Проверим количество сайтов в контракте
  if (deployResult.newlyDeployed) {
    console.log("✅ Contract newly deployed!");
  } else {
    console.log("♻️ Contract already deployed, reusing existing deployment");
  }
};

export default deployRoulette;
deployRoulette.tags = ["Roulette"];

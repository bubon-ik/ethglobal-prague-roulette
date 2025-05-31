import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

const deployRoulette: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const roulette = await deploy("Roulette", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  // Получаем развернутый контракт
  const rouletteContract = await hre.ethers.getContract<Contract>("Roulette", deployer);
  console.log("🎰 Roulette deployed to:", roulette.address);

  // Добавляем тестовые сайты для демо
  const testSites = [
    "https://uniswap.org",
    "https://compound.finance",
    "https://lens.xyz",
    "https://gitcoin.co",
    "https://optimism.io",
    "https://polygon.technology",
    "https://arbitrum.io",
    "https://chainlink.com"
  ];

  console.log("📝 Adding test sites...");
  for (const site of testSites) {
    try {
      const tx = await rouletteContract.addSite(site);
      await tx.wait();
      console.log(`✅ Added: ${site}`);
    } catch (error) {
      console.log(`⚠️ Site ${site} might already exist`);
    }
  }

  console.log(`🎉 Roulette setup complete with ${testSites.length} sites!`);
};

export default deployRoulette;
deployRoulette.tags = ["Roulette"];

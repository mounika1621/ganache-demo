import "dotenv/config";
import { ethers } from "ethers";
import fs from "fs";

async function main() {
  console.log("Connecting to Ganache...");

  const provider = new ethers.JsonRpcProvider(
    "http://127.0.0.1:7545"
  );
    const privateKey = process.env.GANACHE_PRIVATE_KEY;

  if (!privateKey) {
    throw new Error(
      "GANACHE_PRIVATE_KEY is missing. Add it to the .env file."
    );
  }

  const wallet = new ethers.Wallet(privateKey, provider);

  console.log("Deployer address:", wallet.address);

  const balance = await provider.getBalance(wallet.address);

  console.log(
    "Balance:",
    ethers.formatEther(balance),
    "ETH"
  );

  const artifactPath =
    "./artifacts/contracts/FoodTraceability.sol/FoodTraceability.json";

  const artifact = JSON.parse(
    fs.readFileSync(artifactPath, "utf8")
  );

  console.log("Deploying FoodTraceability...");

  const factory = new ethers.ContractFactory(
    artifact.abi,
    artifact.bytecode,
    wallet
  );

  const contract = await factory.deploy();

  console.log("Deployment transaction sent.");

  console.log(
    "Transaction hash:",
    contract.deploymentTransaction()?.hash
  );

  await contract.waitForDeployment();

  const address = await contract.getAddress();

  console.log(
    "FoodTraceability deployed to:",
    address
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
import { ethers } from "ethers";
import fs from "fs";

async function main() {
  console.log("Connecting to Ganache...");

  const provider = new ethers.JsonRpcProvider(
    "http://127.0.0.1:7545"
  );

  // Use your Ganache private key here.
  // Do NOT share it with anyone.
  const privateKey = "0x0b3808a169e9239904b85df856317ac489fcfbe8d1ed7c34b6f203fb96cc13bb";

  const wallet = new ethers.Wallet(privateKey, provider);

  console.log("Wallet:", wallet.address);

  const contractAddress =
    "0x708115D4F3Fb41563009f6Ca71183F856CaE225D";

  const artifactPath =
    "./artifacts/contracts/FoodTraceability.sol/FoodTraceability.json";

  const artifact = JSON.parse(
    fs.readFileSync(artifactPath, "utf8")
  );

  const contract = new ethers.Contract(
    contractAddress,
    artifact.abi,
    wallet
  );

  console.log("Adding food product...");

  const tx = await contract.addProduct(
    "Rice",
    "Mounika",
    "Coimbatore"
  );

  console.log("Transaction sent:");
  console.log(tx.hash);

  await tx.wait();

  console.log("Food product added successfully!");

  const count = await contract.productCount();

  console.log("Total products:", count.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
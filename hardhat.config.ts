import "dotenv/config";
import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";
import { defineConfig } from "hardhat/config";

const ganachePrivateKey = process.env.GANACHE_PRIVATE_KEY;

if (!ganachePrivateKey) {
  throw new Error(
    "GANACHE_PRIVATE_KEY is missing. Add it to the .env file."
  );
}

export default defineConfig({
  plugins: [hardhatToolboxViemPlugin],

  solidity: {
    profiles: {
      default: {
        version: "0.8.34",
        settings: {
          evmVersion: "paris"
        }
      },

      production: {
        version: "0.8.34",
        settings: {
          evmVersion: "paris",
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    }
  },

  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1"
    },

    hardhatOp: {
      type: "edr-simulated",
      chainType: "op"
    },

    ganache: {
      type: "http",
      chainType: "l1",
      url: "http://127.0.0.1:7545",
      accounts: [ganachePrivateKey]
    }
  }
});
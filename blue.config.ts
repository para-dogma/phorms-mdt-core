import { Config } from "@ton/blue";

const config: Config = {
  network: {
    type: "testnet",
    endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
  },
  wallet: {
    type: "mnemonic",
    mnemonic: process.env.MNEMONIC || "",
  },
  contracts: {
    mdt: {
      path: "build/MultidimensionalToken_MultidimensionalToken.code.boc",
      init: "empty", // пустые данные
    },
  },
};

export default config;

import { TonClient, WalletContractV4, internal, OpenedContract } from "@ton/ton";
import { mnemonicToWalletKey } from "@ton/crypto";
import { readFileSync, writeFileSync } from "fs";
import { Cell, beginCell, Address, Contract, ContractProvider } from "@ton/core";

// Контракт MDT
class MDTContract implements Contract {
  constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

  static createFromAddress(address: Address) {
    return new MDTContract(address);
  }

  async sendDeploy(provider: ContractProvider, via: any, value: bigint) {
    await provider.internal(via, {
      value,
      bounce: false,
      init: this.init,
    });
  }
}

async function deploy() {
  const client = new TonClient({
    endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
  });

  const mnemonics = (process.env.MNEMONIC || "").split(" ");
  const keyPair = await mnemonicToWalletKey(mnemonics);
  
  const wallet = WalletContractV4.create({
    workchain: 0,
    publicKey: keyPair.publicKey,
  });

  const walletContract = client.open(wallet) as OpenedContract<WalletContractV4>;

  // Читаем скомпилированный код
  const codeBoc = readFileSync("build/MultidimensionalToken_MultidimensionalToken.code.boc");
  const code = Cell.fromBoc(codeBoc)[0];
  
  // Создаём начальное состояние (data)
  const data = beginCell().endCell(); // Пустые данные для инициализации
  
  // Вычисляем адрес контракта
  const contractAddress = Address.fromBounceable(
    Address.create(0, beginCell().storeUint(0, 8).storeRef(code).storeRef(data).endCell().hash())
  );

  console.log("📤 Deploying from:", wallet.address.toString());
  console.log(" Contract address:", contractAddress.toString());
  
  const balance = await walletContract.getBalance();
  console.log("💰 Wallet balance:", balance.toString());
  
  if (balance < BigInt(0.1 * 1e9)) {
    console.error("❌ Need at least 0.1 TON");
    process.exit(1);
  }

  // Деплой
  const seqno = await walletContract.getSeqno();
  console.log("📦 Sending deploy transaction...");
  
  await walletContract.sendTransfer({
    seqno,
    secretKey: keyPair.secretKey,
    messages: [
      internal({
        to: wallet.address,
        value: "0.1",
        bounce: false,
        init: { code, data },
      }),
    ],
  });

  console.log("⏳ Waiting for confirmation...");
  await new Promise(r => setTimeout(r, 10000));
  
  console.log("✅ Contract deployed!");
  console.log("🔍 View: https://testnet.tonviewer.com/" + contractAddress.toString());
  
  writeFileSync("contract_address.txt", contractAddress.toString());
  console.log("💾 Address saved to contract_address.txt");
}

deploy().catch(console.error);

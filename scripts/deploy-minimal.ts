import { TonClient, WalletContractV4, internal } from "@ton/ton";
import { mnemonicToWalletKey } from "@ton/crypto";
import { readFileSync, writeFileSync } from "fs";
import { Cell, beginCell, Address, Contract, ContractProvider, Sender } from "@ton/core";

async function main() {
  const client = new TonClient({
    endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
  });

  const mnemonics = (process.env.MNEMONIC || "").split(" ");
  const keyPair = await mnemonicToWalletKey(mnemonics);
  
  const wallet = WalletContractV4.create({
    workchain: 0,
    publicKey: keyPair.publicKey,
  });

  const walletContract = client.open(wallet);
  
  // Читаем код контракта
  const codeBoc = readFileSync("build/MultidimensionalToken_MultidimensionalToken.code.boc");
  const code = Cell.fromBoc(codeBoc)[0];
  
  // Пустые данные для инициализации
  const data = beginCell().endCell();
  
  // Вычисляем адрес контракта
  const stateInit = beginCell()
    .storeUint(0, 2) // tick
    .storeUint(0, 1) // tock
    .storeRef(code)
    .storeRef(data)
    .endCell();
  
  const contractAddress = Address.create(0, stateInit.hash());

  console.log("📤 From:", wallet.address.toString());
  console.log("📍 Contract:", contractAddress.toString());
  
  const balance = await walletContract.getBalance();
  console.log("💰 Balance:", balance.toString());
  
  if (balance < BigInt(0.1 * 1e9)) {
    console.error("❌ Need at least 0.1 TON");
    process.exit(1);
  }

  // Деплой через отправку на свой адрес с init
  const seqno = await walletContract.getSeqno();
  console.log("📦 Deploying (seqno:", seqno, ")...");
  
  await walletContract.sendTransfer({
    seqno,
    secretKey: keyPair.secretKey,
    messages: [
      {
        to: wallet.address,
        value: BigInt(0.1 * 1e9),
        bounce: false,
        init: { code, data },
      },
    ],
  });

  console.log("⏳ Waiting 10 seconds...");
  await new Promise(r => setTimeout(r, 10000));
  
  console.log("✅ Done!");
  console.log(" https://testnet.tonviewer.com/" + contractAddress.toString());
  
  writeFileSync("contract_address.txt", contractAddress.toString());
}

main().catch(console.error);

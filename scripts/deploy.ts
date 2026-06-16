import { TonClient, WalletContractV4, internal, ContractProvider } from "@ton/ton";
import { mnemonicToWalletKey } from "@ton/crypto";
import { readFileSync, writeFileSync } from "fs";
import { beginCell, Cell } from "@ton/core";

async function main() {
  // Инициализация клиента
  const client = new TonClient({
    endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
    apiKey: "", // для testnet не требуется
  });

  // Получение ключей из мнемоники
  const mnemonics = (process.env.MNEMONIC || "").split(" ");
  if (mnemonics.length < 24) {
    console.error("❌ Please set MNEMONIC environment variable with 24 words");
    process.exit(1);
  }
  
  const keyPair = await mnemonicToWalletKey(mnemonics);
  
  const wallet = WalletContractV4.create({
    workchain: 0,
    publicKey: keyPair.publicKey,
  });

  // Чтение кода контракта
  const contractCode = Cell.fromBoc(readFileSync("contracts/build/mdt.tact"))[0];
  
  // Адрес кошелька
  const walletAddress = wallet.address;
  console.log("📤 Deploying from wallet:", walletAddress.toString());
  
  // Проверка баланса
  const balance = await client.getBalance(walletAddress);
  console.log("💰 Wallet balance:", balance.toString());
  
  if (balance < BigInt(0.05 * 1e9)) {
    console.error("❌ Insufficient balance. Need at least 0.05 TON");
    process.exit(1);
  }

  // Деплой контракта
  const seqno = await wallet.getSeqno(client);
  
  if (seqno === 0) {
    // Первый деплой - нужно активировать кошелёк
    console.log("🔑 Activating wallet (first deployment)...");
    await wallet.sendTransfer(client, keyPair.secretKey, {
      seqno: 0,
      messages: [
        internal({
          to: walletAddress,
          value: "0.05",
          bounce: false,
          body: contractCode,
        }),
      ],
    });
  } else {
    // Обычный деплой
    console.log("📦 Deploying contract...");
    await wallet.sendTransfer(client, keyPair.secretKey, {
      seqno: seqno,
      messages: [
        internal({
          to: walletAddress,
          value: "0.05",
          bounce: false,
          body: contractCode,
        }),
      ],
    });
  }

  console.log("⏳ Waiting for confirmation...");
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Проверка адреса контракта
  const contractAddress = walletAddress;
  console.log("✅ Contract deployed!");
  console.log("📍 Address:", contractAddress.toString());
  console.log("🔍 View on TonViewer: https://testnet.tonviewer.com/" + contractAddress.toString());
  
  // Сохранение адреса
  writeFileSync("contract_address.txt", contractAddress.toString());
  console.log("💾 Address saved to contract_address.txt");
}

main().catch(console.error);

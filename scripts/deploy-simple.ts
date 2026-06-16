import { TonClient, WalletContractV4, internal } from "@ton/ton";
import { mnemonicToWalletKey } from "@ton/crypto";
import { readFileSync, writeFileSync } from "fs";
import { beginCell, Cell, Address } from "@ton/core";

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

  const contractCode = Cell.fromBoc(readFileSync("contracts/build/mdt.tact"))[0];
  const walletAddress = wallet.address;
  
  console.log("📤 From:", walletAddress.toString());
  
  const balance = await client.getBalance(walletAddress);
  console.log("💰 Balance:", balance.toString());
  
  if (balance < BigInt(0.05 * 1e9)) {
    console.error("❌ Need at least 0.05 TON");
    process.exit(1);
  }

  // Создаём сообщение с кодом контракта
  const message = internal({
    to: walletAddress,
    value: "0.05",
    bounce: false,
    body: contractCode,
  });

  const seqno = await wallet.getSeqno(client);
  
  console.log("📦 Deploying...");
  await wallet.sendTransfer({
    seqno,
    secretKey: keyPair.secretKey,
    messages: [message],
  });

  console.log("⏳ Waiting...");
  await new Promise(r => setTimeout(r, 5000));
  
  console.log("✅ Deployed!");
  console.log(" Address:", walletAddress.toString());
  console.log("🔍 https://testnet.tonviewer.com/" + walletAddress.toString());
  
  writeFileSync("contract_address.txt", walletAddress.toString());
}

deploy().catch(console.error);

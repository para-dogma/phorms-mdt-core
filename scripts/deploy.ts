import { TonClient, Cell } from "@ton/ton";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
    console.log("🚀 PhormS-MDT Deployment Check...");

    const client = new TonClient({
        endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
    });

    // Ищем любой .boc файл в папке build
    const buildDir = path.join(__dirname, "../build");
    
    if (!fs.existsSync(buildDir)) {
        console.error("❌ Build directory not found!");
        return;
    }

    const files = fs.readdirSync(buildDir).filter(f => f.endsWith('.boc'));
    
    if (files.length === 0) {
        console.error("❌ No .boc files found in build/");
        console.log("Files in build/:", fs.readdirSync(buildDir));
        return;
    }

    // Берем первый найденный .boc файл
    const bocFile = path.join(buildDir, files[0]);
    console.log(`📦 Found contract file: ${files[0]}`);

    try {
        const bocData = fs.readFileSync(bocFile);
        const codeCell = Cell.fromBoc(bocData)[0];
        
        console.log("✅ Contract code loaded successfully!");
        console.log("   Code Hash:", codeCell.hash().toString("hex"));
        console.log("\n📝 Next Step: Use Tonkeeper Testnet to deploy this contract.");
    } catch (e) {
        console.error("❌ Failed to parse BOC file:", e);
    }
}

main().catch(console.error);

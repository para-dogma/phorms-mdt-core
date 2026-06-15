# 🚀 PhormS-MDT: Quick Start Demo (5 Minutes)

This guide shows how to generate, validate, and deploy a Multidimensional Token (MDT) for Real-World Assets (RWA).

## Prerequisites
- Node.js 18+ & npm
- Python 3.10+ & pip
- TON Wallet (Tonkeeper or similar) with testnet TON

## Step 1: Generate & Validate MDT Data
Run the ML-powered generator to create token vectors:
```bash
cd scripts/generator
pip install -r requirements.txt # Lightweight mode available via --lightweight flag
python3 mdt_generator.py
```
✅ Output: `generated_mdt.json` + `vector_health.png` (quality visualization)

## Step 2: Deploy Contract to Testnet
Build and deploy the MDT contract using Tact CLI:
```bash
npx tact --config tact.config.json
npx toncli deploy --network testnet contracts/build/mdt.tact
```
💡 Save the deployed contract address from the output.

## Step 3: Verify on TonViewer
Open [https://testnet.tonviewer.com](https://testnet.tonviewer.com) and paste your contract address. You should see:
- 5 vector slots (Identity, State, Quality, Legal, Lineage)
- Merkle root hash matching `generated_mdt.json`
- Time-lock status (30-day consensus period)

## Step 4: Explore Use Cases
Check `use-cases/coffee-tokenization/` for a real-world example of tokenizing a coffee batch with quality metrics and supply chain lineage.

## Troubleshooting
- **ML dependencies too heavy?** Run `python3 mdt_generator.py --lightweight` (pure Python, no sklearn).
- **Deployment failed?** Ensure you have testnet TON and correct wallet mnemonic in `.env`.
- **Vectors look wrong?** Check `vector_health.png` — red zones indicate ML-detected anomalies.

## Next Steps
- Read [README.md](README.md) for architecture details
- Run tests: `npm test` (27+ passing)
- Contribute: See [docs/ISSUE_TEMPLATE_LIGHTWEIGHT_ML.md](docs/ISSUE_TEMPLATE_LIGHTWEIGHT_ML.md)

##  Validation Proof
See [DEPLOYMENT_PROOF.md](DEPLOYMENT_PROOF.md) for ML validation results and compilation status.

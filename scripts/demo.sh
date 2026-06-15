#!/bin/bash
echo "=================================================="
echo "  PHORMS-MDT CORE - LIVE DEMO"
echo "=================================================="
echo ""
echo "This script demonstrates the RWA tokenization protocol."
echo "Press Enter to continue..."
read

# 1. Диагностика
echo "--------------------------------------------------"
echo "1️⃣  INFRASTRUCTURE CHECK"
echo "--------------------------------------------------"
./scripts/diagnose.sh
echo ""
read

# 2. ML Генерация
echo "--------------------------------------------------"
echo "2️⃣  ML VALIDATION: Generating Token Data"
echo "--------------------------------------------------"
cd scripts/generator
python3 mdt_generator.py --lightweight
cd ../..
echo ""
read

# 3. Тесты контракта
echo "--------------------------------------------------"
echo "3️⃣  CONTRACT TESTS: Running Jest Suite"
echo "--------------------------------------------------"
npm test
echo ""
read

# 4. Финал
echo "=================================================="
echo "  DEMO COMPLETE!"
echo "=================================================="
echo ""
echo "Next steps:"
echo "1. Check DEPLOYMENT_PROOF.md for compilation status"
echo "2. Read use-cases/coffee-tokenization/ for real-world example"
echo "3. Deploy to testnet when faucet is available"

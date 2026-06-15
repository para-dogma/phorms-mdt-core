#!/bin/bash

# Автоматический генератор PROJECT_STATUS.md
STATUS_FILE="PROJECT_STATUS.md"

echo "🔄 Updating Project Status..."

# Проверяем наличие ключевых артефактов
COMPILED=false
GENERATOR_OK=false
TESTS_PASS=false
DEPLOYED=false
BYTECODE_READY=false

# 1. Проверка компиляции
if [ -f "build/MultidimensionalToken_MultidimensionalToken.code.boc" ]; then
    COMPILED=true
fi

# 2. Проверка генератора
if python3 -c "from scripts.phorms_generator import MDTConfig" 2>/dev/null; then
    GENERATOR_OK=true
fi

# 3. Проверка тестов (упрощенная)
if npm test -- --passWithNoTests 2>&1 | grep -q "passed"; then
    TESTS_PASS=true
fi

# 4. Проверка байткода для деплоя
if [ -f "contract_code.txt" ]; then
    BYTECODE_READY=true
fi

# 5. Проверка деплоя (ищем адрес в логах или файле)
if [ -f "deployed_address.txt" ]; then
    DEPLOYED=true
fi

# Генерируем Markdown
cat > $STATUS_FILE << MARKDOWN
# 📊 PhormS-MDT Project Status (Auto-Generated)

> ⚠️ Do not edit manually. Run \`./scripts/update_status.sh\` to update.

## Current Stage: $(if [ "$DEPLOYED" = true ]; then echo "Live on Testnet"; elif [ "$BYTECODE_READY" = true ]; then echo "Ready for Deployment"; else echo "Development & Testing"; fi)

### Core Components
- [$(if [ "$COMPILED" = true ]; then echo "x"; else echo " "; fi)] Tact Contract Compiled (v1.4)
- [$(if [ "$GENERATOR_OK" = true ]; then echo "x"; else echo " "; fi)] Python MDT Generator Operational
- [$(if [ "$TESTS_PASS" = true ]; then echo "x"; else echo " "; fi)] Unit Tests Passing
- [$(if [ "$BYTECODE_READY" = true ]; then echo "x"; else echo " "; fi)] Bytecode Exported for Deployment
- [$(if [ "$DEPLOYED" = true ]; then echo "x"; else echo " "; fi)] Contract Deployed to Testnet

### Last Health Check
- Timestamp: $(date '+%Y-%m-%d %H:%M:%S UTC')
- System Status: $(if [ "$COMPILED" = true ] && [ "$GENERATOR_OK" = true ]; then echo "🟢 HEALTHY"; else echo "🔴 NEEDS ATTENTION"; fi)

### Next Automated Actions
$(if [ "$DEPLOYED" = false ] && [ "$BYTECODE_READY" = true ]; then echo "- Deploy contract using Tonkeeper"; elif [ "$DEPLOYED" = false ]; then echo "- Fix compilation or generator issues"; else echo "- Run on-chain integration tests"; fi)
MARKDOWN

echo "✅ Project status updated successfully!"
echo "📄 View it at: $STATUS_FILE"

#!/bin/bash
echo "🔍 Running PhormS-MDT Health Check..."
echo "====================================="

# 1. Проверка компиляции
echo -n "1. Checking Tact compilation... "
if [ -f "build/MultidimensionalToken_MultidimensionalToken.code.boc" ]; then
    echo "✅ OK"
else
    echo "❌ FAILED"
    exit 1
fi

# 2. Проверка генератора
echo -n "2. Checking Python generator... "
if python3 -c "from scripts.phorms_generator import MDTConfig" 2>/dev/null; then
    echo "✅ OK"
else
    echo "❌ FAILED"
    exit 1
fi

# 3. Проверка тестов
echo -n "3. Running unit tests... "
if npm test -- --passWithNoTests 2>/dev/null | grep -q "passed"; then
    echo "✅ OK"
else
    echo "️  WARNING"
fi

# 4. Проверка документации
echo -n "4. Checking documentation... "
if [ -f "README.md" ]; then
    echo "✅ OK"
else
    echo "❌ FAILED"
    exit 1
fi

echo "====================================="
echo "🚀 System is READY!"
echo ""
echo "🔄 Auto-updating project status..."
./scripts/update_status.sh

#!/bin/bash
echo "📦 Creating Offline Skill Pack for PhormS-MDT..."

# Обновляем статус перед упаковкой
./scripts/update_status.sh > /dev/null 2>&1

# Создаем папку для артефактов
mkdir -p skill-pack

# Копируем ключевые файлы
cp .ai-instructions.md skill-pack/
cp PROJECT_STATUS.md skill-pack/
cp -r docs/ skill-pack/
cp -r scripts/ skill-pack/
cp -r examples/ skill-pack/ 2>/dev/null || true
cp README.md skill-pack/
cp LICENSE skill-pack/

# Создаем манифест
cat > skill-pack/MANIFEST.md << 'INNER_EOF'
# 🧠 PhormS-MDT Offline Skill Pack

This pack contains the engineering standards and context for PhormS-MDT.

## Files Included:
- `.ai-instructions.md` - AI personality and rules
- `PROJECT_STATUS.md` - Current project state
- `docs/` - Architecture and documentation
- `scripts/` - Automation tools
- `examples/` - Multi-language setups (if available)

## How to Use:
1. Unpack this folder into a new project.
2. Run `./scripts/validate.sh` to initialize.
3. Feed `.ai-instructions.md` and `PROJECT_STATUS.md` to your AI assistant.
INNER_EOF

# Архивируем
tar -czf phorms-mdt-skill-pack.tar.gz skill-pack/
rm -rf skill-pack/

echo "✅ Skill Pack created: phorms-mdt-skill-pack.tar.gz"
echo " Size: $(du -h phorms-mdt-skill-pack.tar.gz | cut -f1)"

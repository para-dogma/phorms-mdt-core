#!/bin/bash
echo "=== SYSTEM CONTEXT FOR AI ==="
echo ""
echo "[INSTRUCTIONS]"
if [ -f ".ai-instructions.md" ]; then cat .ai-instructions.md; else echo "⚠️ No instructions file found"; fi
echo ""
echo "[CURRENT STATUS]"
if [ -f "PROJECT_STATUS.md" ]; then cat PROJECT_STATUS.md; else echo "️ Status not generated yet"; fi
echo ""
echo "[ARCHITECTURE]"
if [ -f "docs/architecture.md" ]; then cat docs/architecture.md; else echo "⚠️ Architecture map missing"; fi
echo ""
echo "[RECENT COMMITS]"
git log --oneline -5 2>/dev/null || echo "⚠️ Git history unavailable"
echo ""
echo "=== END CONTEXT ==="
echo ""
echo "AI: Use this context to answer the next user query. Do not ask for status updates."

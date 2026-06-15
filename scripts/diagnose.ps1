# PowerShell诊断脚本 для PhormS-MDT Core
Write-Host " Diagnosing PhormS-MDT Core Infrastructure..." -ForegroundColor Cyan
$ERRORS = 0

# Проверка Node.js (для Tact и Jest)
if (Get-Command node -ErrorAction SilentlyContinue) {
    $nodeVersion = node -v
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js is required for Tact & Jest!" -ForegroundColor Red
    exit 1
}

# Проверка Python (для ML-генератора)
if (Get-Command python3 -ErrorAction SilentlyContinue) {
    Write-Host "✅ Python3 available for ML generator" -ForegroundColor Green
} else {
    Write-Host "⚠️  Python3 missing (ML features unavailable)" -ForegroundColor Yellow
}

# Проверка ключевых файлов
$files = @("contracts/mdt.tact", "scripts/generator/mdt_generator.py", "package.json")
foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "✅ $file exists" -ForegroundColor Green
    } else {
        Write-Host "❌ $file missing!" -ForegroundColor Red
        $ERRORS++
    }
}

Write-Host ""
if ($ERRORS -eq 0) {
    Write-Host "🎉 MDT Core infrastructure is HEALTHY." -ForegroundColor Green
} else {
    Write-Host "🛑 Found $ERRORS critical issues." -ForegroundColor Red
    exit 1
}

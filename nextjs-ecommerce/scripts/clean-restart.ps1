# Clean restart script for Windows
Write-Host "🧹 Cleaning project..." -ForegroundColor Yellow

# Stop any running processes
Write-Host "⏸️  Stopping dev server..." -ForegroundColor Cyan
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue

# Remove cache folders
Write-Host "🗑️  Removing .next..." -ForegroundColor Cyan
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue

Write-Host "🗑️  Removing node_modules..." -ForegroundColor Cyan
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue

Write-Host "🗑️  Removing package-lock.json..." -ForegroundColor Cyan
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue

# Reinstall
Write-Host "📦 Installing dependencies..." -ForegroundColor Green
npm install

# Generate Prisma
Write-Host "🔧 Generating Prisma Client..." -ForegroundColor Green
npx prisma generate

Write-Host "✅ Clean complete! Run 'npm run dev' to start." -ForegroundColor Green


#!/bin/bash
# Script to switch from Yarn to npm

echo "🔄 Switching from Yarn to npm..."

cd "$(dirname "$0")/.."

# Remove yarn.lock
if [ -f "yarn.lock" ]; then
    echo "🗑️  Removing yarn.lock..."
    rm yarn.lock
    echo "✅ yarn.lock removed"
else
    echo "ℹ️  yarn.lock not found"
fi

# Remove node_modules
echo "🧹 Cleaning node_modules..."
rm -rf node_modules

# Install with npm to create package-lock.json
echo "📦 Installing with npm..."
npm install --legacy-peer-deps

if [ -f "package-lock.json" ]; then
    echo "✅ package-lock.json created"
else
    echo "⚠️  package-lock.json not created"
fi

echo ""
echo "✅ Done! Now commit and push:"
echo "   git add package-lock.json .npmrc"
echo "   git rm yarn.lock"
echo "   git commit -m 'Switch to npm'"
echo "   git push"


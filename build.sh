#!/bin/bash
set -e

echo "Installing Bun..."
curl -fsSL https://bun.sh/install | bash
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

# Verify Bun installation
bun --version

echo "Installing dependencies..."
bun install

echo "Building project..."
NODE_ENV=production bun run build

# Verify build output exists
if [ -d ".svelte-kit/cloudflare" ]; then
    echo "Build completed successfully!"
    echo "Build output is in .svelte-kit/cloudflare"
else
    echo "Build failed: Output directory not found"
    exit 1
fi

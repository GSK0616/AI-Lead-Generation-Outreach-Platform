#!/bin/bash

set -e

echo "LeadForge AI - Setup Script"
echo "==========================="

# Check Node.js version
echo "✓ Checking Node.js..."
node_version=$(node -v)
echo "  Node.js $node_version"

# Install dependencies
echo "✓ Installing dependencies..."
npm install

# Check environment variables
echo "✓ Checking environment variables..."
if [ ! -f .env.local ]; then
  echo "  Creating .env.local from .env.example..."
  cp .env.example .env.local
  echo "  ⚠️  Please update .env.local with your configuration"
else
  echo "  .env.local already exists"
fi

# Build project
echo "✓ Building project..."
npm run build

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your Supabase and Stripe keys"
echo "2. Run database migrations: supabase migration up"
echo "3. Start development: npm run dev"
echo ""

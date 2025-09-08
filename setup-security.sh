#!/bin/bash

# Security Setup Script for Krishi Voice Sahayak

echo "🔒 Setting up security configurations..."

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please update .env with your actual API keys"
else
    echo "✅ .env file already exists"
fi

# Check if security packages are installed
echo "📦 Checking security dependencies..."
if npm list express-validator > /dev/null 2>&1; then
    echo "✅ express-validator installed"
else
    echo "❌ Installing express-validator..."
    npm install express-validator
fi

if npm list express-rate-limit > /dev/null 2>&1; then
    echo "✅ express-rate-limit installed"
else
    echo "❌ Installing express-rate-limit..."
    npm install express-rate-limit
fi

if npm list helmet > /dev/null 2>&1; then
    echo "✅ helmet installed"
else
    echo "❌ Installing helmet..."
    npm install helmet
fi

echo ""
echo "🔐 Security Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Update .env with your actual API keys"
echo "2. Review CORS origins in server.js for production"
echo "3. Set NODE_ENV=production for production deployment"
echo "4. Review SECURITY.md for complete security guidelines"
echo ""
echo "⚠️  IMPORTANT: Never commit .env file to git!"

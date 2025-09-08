#!/bin/bash

echo "🔒 Creating Secure Repository Setup"
echo "=================================="

# Create new directory
NEW_REPO_NAME="krishi-voice-sahayak-secure"
cd ..
mkdir -p $NEW_REPO_NAME
cd $NEW_REPO_NAME

echo "📂 Created new directory: $NEW_REPO_NAME"

# Initialize new git repository
git init
echo "✅ Initialized new git repository"

# Copy files from old repository (excluding .git and .env)
echo "📋 Copying files from old repository..."
rsync -av --exclude='.git' --exclude='.env' --exclude='node_modules' ../krishi-voice-sahayak/ ./

# Create new .env from example
cp .env.example .env
echo "📝 Created new .env file from template"

echo ""
echo "🚨 IMPORTANT: Before proceeding:"
echo "1. Open .env file and add your NEW API keys"
echo "2. Make sure you've revoked the old API keys"
echo "3. Test the application locally"
echo ""
echo "📋 Next steps:"
echo "1. Edit .env with your new API keys"
echo "2. Run: npm install"
echo "3. Run: npm run dev"
echo "4. Test the application"
echo "5. Create GitHub repository: $NEW_REPO_NAME"
echo "6. Run: git remote add origin YOUR_NEW_REPO_URL"
echo "7. Run: git add ."
echo "8. Run: git commit -m 'Initial secure commit'"
echo "9. Run: git push -u origin main"
echo ""
echo "✅ Setup complete! Remember to update your API keys first!"

#!/bin/bash

echo "🚀 Starting deployment process..."

# Build the project
echo "📦 Building project..."
npm run build

# Stage changes
echo "📝 Staging changes..."
git add .

# Commit changes
echo "💾 Committing changes..."
read -p "Enter commit message: " commit_message
git commit -m "$commit_message"

# Push to main branch
echo "⬆️ Pushing to main branch..."
git push origin main

echo "✅ Deployment complete! Check GitHub Actions for build status."

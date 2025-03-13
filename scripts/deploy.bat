@echo off
echo 🚀 Starting deployment process...

:: Build the project
echo 📦 Building project...
call npm run build

:: Stage changes
echo 📝 Staging changes...
call git add .

:: Commit changes
echo 💾 Committing changes...
set /p commit_message=Enter commit message: 
call git commit -m "%commit_message%"

:: Push to main branch
echo ⬆️ Pushing to main branch...
call git push origin main

echo ✅ Deployment complete! Check GitHub Actions for build status.

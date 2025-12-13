@echo off
echo --- Konkur Platform Git Automator V2 ---

:: Check if git is installed
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Git is still not recognized. Please restart your computer or command prompt if you just installed it.
    pause
    exit /b
)

echo.
echo [0/5] Git Configuration (Required for first time)
echo We need to set your name and email for the commit history.
echo.

set /p GIT_EMAIL="Enter your Email (e.g., mail@example.com): "
set /p GIT_NAME="Enter your Name (e.g., Milad): "

git config --global user.email "%GIT_EMAIL%"
git config --global user.name "%GIT_NAME%"

echo.
echo [1/5] Initializing Git...
git init

echo [2/5] Adding files...
git add .

echo [3/5] Committing changes...
git commit -m "Final Soft Launch Version - Financial Module Included"

echo.
echo [4/5] Setting up Remote...
set /p REPO_URL="Enter your GitHub Repository URL again (e.g., https://github.com/miladVR/KONKOOR.git): "
:: Remove existing origin if exists to avoid error
git remote remove origin 2>nul
git remote add origin %REPO_URL%
git branch -M main

echo [5/5] Pushing to GitHub...
git push -u origin main

echo.
echo [SUCCESS] If you see no red errors above, code is on GitHub!
echo Now go to Vercel.com -> Add New -> Project -> Import from GitHub.
pause

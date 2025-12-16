@echo off
echo --- Konkur Platform Git Automator (Fully Automated) ---

:: 1. Force Git Configuration (using dummy values to bypass strict check)
git config --global user.email "deploy@konkoor.ir"
git config --global user.name "DeployBot"

:: 2. Add all files
echo [Step 1] Adding files...
git add .

:: 3. Commit
echo [Step 2] Committing...
git commit -m "Final Deploy Fixes - Vercel Config"

:: 4. Setup Remote (Force update)
echo [Step 3] Connecting to GitHub...
git remote remove origin 2>nul
git remote add origin https://github.com/miladVR/KONKOOR.git
git branch -M main

:: 5. Push
echo [Step 4] Pushing to GitHub...
git push -u origin main

echo.
echo [DONE] ---------------------------------------------------
echo If you see "Branch 'main' set up to track remote branch 'main' from 'origin'", IT IS DONE.
echo Now go to Vercel and click "Redeploy".
echo ---------------------------------------------------
pause

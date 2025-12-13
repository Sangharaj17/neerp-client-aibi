@echo off
(
echo Stashing changes...
git stash
echo.
echo Pulling changes...
git pull
echo.
echo Popping stash...
git stash pop
echo.
echo Done!
) > resolve_log.txt 2>&1

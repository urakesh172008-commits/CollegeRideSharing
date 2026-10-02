@echo off
set "TARGET=%~dp0OpenWebsite.bat"
set "SHORTCUT=%USERPROFILE%\Desktop\UniRide.lnk"

powershell -Command "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut('%SHORTCUT%'); $s.TargetPath = '%TARGET%'; $s.WorkingDirectory = '%~dp0'; $s.Description = 'UniRide - College Ride Sharing Website'; $s.Save()"

echo.
echo =======================================================
echo   UniRide Shortcut has been placed on your Desktop!
echo =======================================================
echo.
pause

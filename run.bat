@echo off
echo ===================================================
echo     UniRide - College Ride Sharing Web App
echo ===================================================
echo.
echo 1. Launch Modern React Web App (Vite)
echo 2. Launch Pure Java HttpServer (Backend)
echo.
set /p choice="Select option (1 or 2) [Default: 1]: "
if "%choice%"=="" set choice=1

if "%choice%"=="1" (
    echo Starting Modern React Web App on http://localhost:5173...
    cd frontend
    npm run dev
) else (
    set "JAVA_PATH=C:\Users\Rakesh U\AppData\Local\Programs\Microsoft\jdk-17.0.10.7-hotspot\bin"
    if exist "%JAVA_PATH%\javac.exe" (
        set "PATH=%JAVA_PATH%;%PATH%"
    )
    echo Compiling Java files...
    javac *.java
    echo Starting Java WebServer on http://localhost:8080...
    java WebServer
)

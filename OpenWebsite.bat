@echo off
start "" "http://localhost:5173"
cd /d "%~dp0frontend"
npm run dev

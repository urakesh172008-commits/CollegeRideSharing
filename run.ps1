Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "     UniRide - College Ride Sharing Web App" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Launch Modern React Web App (Vite)"
Write-Host "2. Launch Pure Java HttpServer (Backend)"
Write-Host ""

$choice = Read-Host "Select option (1 or 2) [Default: 1]"
if ([string]::IsNullOrWhiteSpace($choice) -or $choice -eq "1") {
    Write-Host "Starting Modern React Web App on http://localhost:5173..." -ForegroundColor Green
    Set-Location -Path "$PSScriptRoot\frontend"
    & npm run dev
} else {
    $JavaBin = "C:\Users\Rakesh U\AppData\Local\Programs\Microsoft\jdk-17.0.10.7-hotspot\bin"
    if (Test-Path "$JavaBin\javac.exe") {
        $env:Path = "$JavaBin;$env:Path"
    }
    Write-Host "Compiling College Ride Sharing System..." -ForegroundColor Cyan
    & javac *.java
    Write-Host "Starting Java WebServer on http://localhost:8080..." -ForegroundColor Green
    & java WebServer
}

@echo off
title VastraSetu Platform Launcher
cls

echo ====================================================================
echo                   🌿 VastraSetu DPP Platform 🌿
echo ====================================================================
echo.
echo  Starting VastraSetu Services...
echo  - Frontend (React + Vite):   http://localhost:5173
echo  - Spring Boot API (Java):    http://localhost:8085
echo  - Express Node API:          http://localhost:5000
echo  - Database (PostgreSQL):     localhost:5432 (vastrasetu_db)
echo.
echo ====================================================================
echo.

:: Load environment variables from .env if present
if exist .env (
    echo Loading local environment variables from .env...
    for /f "usebackq eol=# tokens=1* delims==" %%A in (".env") do (
        if not "%%A"=="" set "%%A=%%B"
    )
)

:: Launch Spring Boot Backend in a separate window
echo [1/3] Launching Spring Boot Backend (Java 21 + PostgreSQL + OpenRouter AI)...
start "VastraSetu Spring Boot Backend" cmd /k "cd server-springboot && mvn spring-boot:run"

:: Wait 3 seconds
timeout /t 3 /nobreak >nul

:: Launch Node Express Server in a separate window
echo [2/3] Launching Express Node API...
start "VastraSetu Express API" cmd /k "npm run server"

:: Wait 2 seconds
timeout /t 2 /nobreak >nul

:: Launch React Frontend Client in a separate window
echo [3/3] Launching React Frontend...
start "VastraSetu React Client" cmd /k "npm run client"

echo.
echo ====================================================================
echo  ✅ All VastraSetu services launched!
echo  Opening http://localhost:5173 in your default browser...
echo ====================================================================

timeout /t 3 /nobreak >nul
start http://localhost:5173/

pause

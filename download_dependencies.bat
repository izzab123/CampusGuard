@echo off
setlocal enabledelayedexpansion

title CampusGuard - Download Dependencies

:: Navigate to project root directory regardless of how the script was launched
cd /d "%~dp0"

echo =====================================================================
echo           CampusGuard - Dependency Downloader and Installer
echo =====================================================================
echo.

:: -----------------------------------------------------------------------
:: 1. Check Prerequisites
:: -----------------------------------------------------------------------
echo [INFO] Checking system prerequisites...

where java >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Java is not installed or not found in system PATH.
    echo         Please install JDK 21 or later and ensure 'java' is in your PATH.
    goto :handle_error
)

where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not installed or not found in system PATH.
    echo         Please install Node.js v18 or newer from https://nodejs.org/
    goto :handle_error
)

where npm >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] npm is not installed or not found in system PATH.
    echo         Please ensure npm is in your PATH.
    goto :handle_error
)

for /f "tokens=*" %%v in ('node -v 2^>nul') do set "NODE_VER=%%v"
for /f "tokens=*" %%v in ('npm -v 2^>nul') do set "NPM_VER=%%v"
echo [OK] Java detected.
echo [OK] Node.js !NODE_VER! detected.
echo [OK] npm !NPM_VER! detected.
echo.

:: -----------------------------------------------------------------------
:: 2. Download Backend Dependencies (Maven / Spring Boot)
:: -----------------------------------------------------------------------
echo =====================================================================
echo  [1/2] Resolving and Downloading Backend Dependencies [Spring Boot]
echo =====================================================================
if not exist "%~dp0backend" (
    echo [ERROR] Backend folder not found at "%~dp0backend".
    goto :handle_error
)

cd /d "%~dp0backend"

if exist "mvnw.cmd" (
    echo [INFO] Using Maven Wrapper [mvnw.cmd]...
    set "MVN_EXEC=mvnw.cmd"
) else (
    where mvn >nul 2>&1
    if !ERRORLEVEL! equ 0 (
        echo [INFO] Using system Maven [mvn]...
        set "MVN_EXEC=mvn"
    ) else (
        echo [ERROR] Neither mvnw.cmd nor system Maven was found in backend.
        goto :handle_error
    )
)

echo [INFO] Resolving project dependencies and build plugins...
call !MVN_EXEC! dependency:resolve test-compile -DskipTests
if !ERRORLEVEL! neq 0 (
    echo.
    echo [ERROR] Failed to download backend dependencies.
    goto :handle_error
)

echo.
echo [OK] Backend dependencies successfully downloaded and verified!
echo.

:: -----------------------------------------------------------------------
:: 3. Download Frontend Dependencies (Node.js / Next.js)
:: -----------------------------------------------------------------------
echo =====================================================================
echo  [2/2] Resolving and Downloading Frontend Dependencies [Next.js]
echo =====================================================================
if not exist "%~dp0frontend" (
    echo [ERROR] Frontend folder not found at "%~dp0frontend".
    goto :handle_error
)

cd /d "%~dp0frontend"

echo [INFO] Running 'npm install' to install frontend dependencies...
call npm install
if !ERRORLEVEL! neq 0 (
    echo.
    echo [ERROR] Failed to install frontend dependencies.
    goto :handle_error
)

echo.
echo [OK] Frontend dependencies successfully installed!
echo.

:: -----------------------------------------------------------------------
:: Success
:: -----------------------------------------------------------------------
cd /d "%~dp0"
echo =====================================================================
echo  SUCCESS: All required backend and frontend dependencies are ready!
echo =====================================================================
echo.
echo You can now start the applications:
echo   1. Backend:
echo      cd backend
echo      .\mvnw.cmd spring-boot:run
echo.
echo   2. Frontend:
echo      cd frontend
echo      npm run dev
echo =====================================================================
goto :end

:handle_error
cd /d "%~dp0"
echo.
echo =====================================================================
echo  FAILED: One or more dependencies failed to download or configure.
echo =====================================================================
echo.

:end
echo.
echo Press any key to exit...
pause >nul

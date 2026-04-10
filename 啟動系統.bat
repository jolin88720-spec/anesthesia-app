@echo off
chcp 65001 >nul
echo ================================
echo  麻醉護理師 AI 訓練系統 啟動器
echo ================================
echo.

cd /d "%~dp0anesthesia-app"

:: Check if node_modules exists
if not exist "node_modules" (
    echo [1/2] 第一次執行，安裝套件中...（約需 2-3 分鐘）
    echo.
    npm install
    if errorlevel 1 (
        echo.
        echo [錯誤] npm install 失敗，請確認 Node.js 已安裝。
        echo 下載網址: https://nodejs.org
        pause
        exit /b 1
    )
    echo.
    echo [完成] 套件安裝成功！
    echo.
) else (
    echo [✓] 套件已安裝，直接啟動
)

echo [2/2] 啟動開發伺服器...
echo.
echo 請稍後，瀏覽器將自動開啟 http://localhost:3000
echo 按 Ctrl+C 可停止伺服器
echo.

start "" "http://localhost:3000"
npm run dev
pause

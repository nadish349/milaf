@echo off
echo 🔒 Installing Secure Payment Dependencies...
echo ==============================================

REM Check if we're in the backend directory
if not exist "package.json" (
    echo ❌ Error: Please run this script from the backend directory
    pause
    exit /b 1
)

REM Install firebase-admin
echo 📦 Installing firebase-admin...
npm install firebase-admin@^12.0.0

if %errorlevel% equ 0 (
    echo ✅ firebase-admin installed successfully
) else (
    echo ❌ Failed to install firebase-admin
    pause
    exit /b 1
)

REM Check if .env file exists
if not exist ".env" (
    echo 📝 Creating .env file...
    (
        echo # Razorpay Configuration
        echo RAZORPAY_KEY_ID=your_razorpay_key_id_here
        echo RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
        echo.
        echo # Firebase Configuration
        echo FIREBASE_PROJECT_ID=milafcola-australia
    ) > .env
    echo ✅ .env file created
    echo ⚠️  Please update .env with your actual Razorpay keys
) else (
    echo ✅ .env file already exists
)

echo.
echo 🎉 Installation Complete!
echo.
echo Next Steps:
echo 1. Update backend/.env with your Razorpay keys
echo 2. Start the server: npm start
echo 3. Test the implementation: node test-secure-payment.js
echo.
echo Security Features Enabled:
echo ✅ Server-side product validation
echo ✅ Client price rejection
echo ✅ Audit trail logging
echo ✅ Environment validation
echo.
echo For detailed setup instructions, see SECURE_PAYMENT_SETUP.md
pause


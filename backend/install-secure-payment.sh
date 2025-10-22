#!/bin/bash

echo "🔒 Installing Secure Payment Dependencies..."
echo "=============================================="

# Check if we're in the backend directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the backend directory"
    exit 1
fi

# Install firebase-admin
echo "📦 Installing firebase-admin..."
npm install firebase-admin@^12.0.0

if [ $? -eq 0 ]; then
    echo "✅ firebase-admin installed successfully"
else
    echo "❌ Failed to install firebase-admin"
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here

# Firebase Configuration
FIREBASE_PROJECT_ID=milafcola-australia
EOF
    echo "✅ .env file created"
    echo "⚠️  Please update .env with your actual Razorpay keys"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🎉 Installation Complete!"
echo ""
echo "Next Steps:"
echo "1. Update backend/.env with your Razorpay keys"
echo "2. Start the server: npm start"
echo "3. Test the implementation: node test-secure-payment.js"
echo ""
echo "Security Features Enabled:"
echo "✅ Server-side product validation"
echo "✅ Client price rejection"
echo "✅ Audit trail logging"
echo "✅ Environment validation"
echo ""
echo "For detailed setup instructions, see SECURE_PAYMENT_SETUP.md"


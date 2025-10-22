# Secure Payment Setup Guide

## Overview
This guide covers the secure Razorpay payment implementation with server-side product validation.

## Prerequisites
- Node.js 16+ installed
- Firebase project: `milafcola-australia`
- Razorpay account with API keys

## Installation Steps

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Variables
Create or update `backend/.env` file:
```env
# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here

# Firebase Configuration (optional - uses default credentials)
FIREBASE_PROJECT_ID=milafcola-australia
```

### 3. Firebase Admin Setup
The backend is configured to use Firebase Admin SDK with the project ID `milafcola-australia`.

**Option A: Default Credentials (Recommended for development)**
- No additional setup required
- Uses default Google Cloud credentials

**Option B: Service Account Key**
1. Go to Firebase Console → Project Settings → Service Accounts
2. Generate new private key
3. Save as `backend/service-account-key.json`
4. Update `backend/firebase-admin.js`:
```javascript
const serviceAccount = require('./service-account-key.json');
adminApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'milafcola-australia',
});
```

## Security Features

### ✅ Server-Side Validation
- All product prices validated against Firestore
- Client-submitted prices completely ignored
- Product existence verified before payment

### ✅ Audit Trail
- All payment attempts logged to Firestore `payments` collection
- Includes validated items, user ID, and timestamps
- Prevents payment manipulation

### ✅ Input Validation
- Cart item structure validation
- Quantity and price validation
- Invalid products rejected before payment

## Testing

### 1. Start Backend Server
```bash
cd backend
npm start
```

### 2. Test Payment Flow
1. Add items to cart in frontend
2. Proceed to payment
3. Check Firestore `payments` collection for audit records
4. Verify server-side price validation

### 3. Test Security Features
- Try invalid product names (should be rejected)
- Try negative quantities (should be rejected)
- Try zero total amounts (should be rejected)

## API Endpoints

### POST /api/payment/create-order
**Request Body:**
```json
{
  "cartItems": [
    {
      "name": "Product Name",
      "quantity": 2,
      "cases": true,
      "pieces": false
    }
  ],
  "zipcode": "2170",
  "userId": "user123"
}
```

**Response:**
```json
{
  "orderId": "order_xyz",
  "amount": 5000,
  "currency": "INR"
}
```

## Firestore Collections

### payments
Audit records for all payment attempts:
```json
{
  "userId": "user123",
  "items": [
    {
      "name": "Product Name",
      "quantity": 2,
      "price": 25.00,
      "cases": true,
      "pieces": false,
      "itemTotal": 50.00
    }
  ],
  "totalAmount": 50.00,
  "shippingAmount": 5.99,
  "grandTotal": 55.99,
  "validatedAt": "2024-01-01T00:00:00Z",
  "validated": true,
  "status": "pending"
}
```

## Troubleshooting

### Common Issues

1. **Firebase Admin initialization fails**
   - Check project ID is correct
   - Verify Firebase project exists
   - Ensure proper credentials

2. **Product not found errors**
   - Verify product names match Firestore document IDs
   - Check products collection exists
   - Ensure product documents have required fields

3. **Razorpay key errors**
   - Verify environment variables are set
   - Check key format and validity
   - Ensure keys are for correct environment (test/live)

### Debug Logs
The server provides detailed logging:
- 🔑 Razorpay key status
- 🔥 Firebase Admin initialization
- 💰 Payment calculations
- 📝 Audit record creation
- ❌ Error details

## Production Deployment

### Environment Variables
Set these in your production environment:
- `RAZORPAY_KEY_ID` - Your live Razorpay key
- `RAZORPAY_KEY_SECRET` - Your live Razorpay secret
- `FIREBASE_PROJECT_ID` - milafcola-australia

### Security Checklist
- [ ] No hardcoded credentials
- [ ] Environment variables properly set
- [ ] Firebase Admin credentials secure
- [ ] Razorpay keys are live (not test)
- [ ] Audit logging enabled
- [ ] Error handling comprehensive

## Support

For issues or questions:
1. Check server logs for error details
2. Verify Firestore connectivity
3. Test with valid product data
4. Ensure all environment variables are set


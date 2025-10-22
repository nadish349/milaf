# 🥤 **Milaf Cola Australia & NZ**

A modern e-commerce platform for Milaf Cola beverages, dates, and spreads with secure payment processing and order management.

## 🚀 **Features**

- **🛒 E-commerce Platform** - Complete shopping experience
- **💳 Secure Payments** - Razorpay integration with server-side validation
- **📦 Order Management** - Real-time order tracking and history
- **🚚 Shipping Integration** - Australian Post API for shipping calculations
- **🔥 Firebase Backend** - Real-time database and authentication
- **📱 Responsive Design** - Mobile-first approach
- **🔐 Secure Authentication** - Firebase Auth with JWT tokens

## 🛠 **Tech Stack**

### **Frontend:**
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Firebase Client SDK** - Real-time database and auth

### **Backend:**
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Firebase Admin SDK** - Server-side database operations
- **Razorpay** - Payment gateway integration
- **Australian Post API** - Shipping calculations

## 🚀 **Quick Start**

### **Prerequisites:**
- Node.js 18+ 
- npm or yarn
- Firebase project
- Razorpay account
- Australian Post API key

### **Installation:**

```bash
# Clone the repository
git clone https://github.com/yourusername/milaf-cola-australia.git
cd milaf-cola-australia

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Start development server
npm run dev

# Start backend server (in separate terminal)
npm run backend:dev
```

### **Environment Setup:**

#### **Frontend (.env):**
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_AUSPOST_API_KEY=your_auspost_api_key
```

#### **Backend (.env):**
```env
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
FIREBASE_PROJECT_ID=your_firebase_project_id
AUSPOST_API_KEY=your_auspost_api_key
```

## 🏗 **Project Structure**

```
milaf-cola-australia/
├── src/                          # Frontend source code
│   ├── components/               # Reusable React components
│   ├── pages/                    # Page components
│   ├── contexts/                 # React contexts (Auth, Cart)
│   ├── services/                 # API services and utilities
│   ├── utils/                    # Helper functions
│   └── assets/                   # Static assets
├── backend/                      # Backend server
│   ├── server.js                 # Express server
│   ├── controllers/              # Route controllers
│   ├── firebase-admin.js         # Firebase Admin SDK
│   └── package.json              # Backend dependencies
├── public/                       # Static files
├── dist/                         # Build output
└── vercel.json                   # Vercel deployment config
```

## 🔧 **Development**

### **Available Scripts:**

```bash
# Frontend development
npm run dev              # Start Vite dev server
npm run build           # Build for production
npm run preview         # Preview production build

# Backend development
npm run backend:dev     # Start backend server
npm run backend:start   # Start backend in production
```

### **Key Features:**

#### **🛒 Shopping Cart:**
- Add/remove items
- Quantity management
- Price calculations
- Persistent cart state

#### **💳 Payment Processing:**
- Razorpay integration
- Server-side validation
- Secure order creation
- Payment verification

#### **📦 Order Management:**
- Order history
- Order tracking
- Item type classification (Cases/Units)
- PDF order generation

#### **🚚 Shipping:**
- Australian Post integration
- Real-time shipping rates
- Address validation
- Delivery time estimates

## 🚀 **Deployment**

### **Vercel Deployment:**

1. **Connect to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/milaf-cola-australia.git
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Connect GitHub repository to Vercel
   - Configure environment variables
   - Deploy automatically

### **Environment Variables for Vercel:**

```
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
FIREBASE_PROJECT_ID=your_firebase_project_id
AUSPOST_API_KEY=your_auspost_api_key
NODE_ENV=production
```

## 🔐 **Security Features**

- **Server-side Validation** - All calculations done on server
- **Payment Verification** - Razorpay signature verification
- **Firebase Security Rules** - Database access control
- **Environment Variables** - Secure configuration
- **HTTPS Only** - Secure connections

## 📱 **Responsive Design**

- **Mobile First** - Optimized for mobile devices
- **Tablet Support** - Responsive tablet layouts
- **Desktop Enhanced** - Full desktop experience
- **Touch Friendly** - Mobile-optimized interactions

## 🧪 **Testing**

### **Manual Testing:**
1. **Cart Functionality** - Add/remove items
2. **Payment Flow** - Complete payment process
3. **Order Management** - Check order history
4. **Shipping** - Test shipping calculations

### **API Testing:**
```bash
# Test payment creation
curl -X POST http://localhost:4000/api/payment/create \
  -H "Content-Type: application/json" \
  -d '{"cartItems": [], "zipcode": "4000", "userId": "test"}'

# Test shipping calculation
curl -X GET "http://localhost:4000/api/parcel/services?to_postcode=4000"
```

## 📊 **Performance**

- **Vite Build** - Fast development and optimized builds
- **Code Splitting** - Lazy loading for better performance
- **CDN Distribution** - Global content delivery
- **Image Optimization** - Optimized asset delivery

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 **Support**

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

## 🎉 **Acknowledgments**

- **Razorpay** - Payment processing
- **Firebase** - Backend services
- **Australian Post** - Shipping calculations
- **Vercel** - Deployment platform
- **React** - Frontend framework

---

**Built with ❤️ for Milaf Cola Australia & NZ** 🥤
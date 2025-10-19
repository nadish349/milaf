# Firebase OAuth Setup Guide

## 🔧 **Steps to Fix OAuth Domain Error**

### **1. Add Vercel Domain to Firebase Console**

1. Go to: https://console.firebase.google.com/project/milafcola-australia/authentication/settings
2. Scroll down to "Authorized domains" section
3. Click "Add domain"
4. Add these domains:
   - `localhost` (for development)
   - `milaf-arabia-5ecy8na6i-nadish349s-projects.vercel.app` (your current Vercel domain)
   - `milaf-arabia.vercel.app` (if you have a custom domain)

### **2. Verify OAuth Providers**

1. In Firebase Console → Authentication → Sign-in method
2. Ensure "Google" is enabled
3. Add authorized domains:
   - `localhost:3000` (for development)
   - `milaf-arabia-5ecy8na6i-nadish349s-projects.vercel.app` (for production)

### **3. Test the Fix**

After adding the domains:
1. Deploy to Vercel: `vercel --prod`
2. Test Google OAuth on your live site
3. The error should be resolved

### **4. Your Current Vercel URLs**

- **Production**: https://milaf-arabia-5ecy8na6i-nadish349s-projects.vercel.app
- **Preview**: https://milaf-arabia.vercel.app (if available)

### **5. Common Issues & Solutions**

**Issue**: "This domain is not authorized"
**Solution**: Add the exact domain to Firebase Console

**Issue**: OAuth popup blocked
**Solution**: Ensure popup blockers are disabled

**Issue**: Redirect URI mismatch
**Solution**: Check that the domain in Firebase matches your Vercel domain exactly

## ✅ **Expected Result**

After adding the domains to Firebase Console, your Google OAuth should work on:
- ✅ localhost (development)
- ✅ Vercel production domain
- ✅ Any custom domains you add


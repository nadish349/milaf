# Vercel Deployment Guide for Milaf Arabia

## Backend Deployment Setup

### 1. Environment Variables Setup

You need to configure the following environment variables in your Vercel dashboard:

#### Required Environment Variables:
- `AUSPOST_API_KEY` - Your Australian Post API key
- `RAZORPAY_KEY_ID` - Your Razorpay key ID
- `RAZORPAY_KEY_SECRET` - Your Razorpay key secret
- `NODE_ENV` - Set to "production"

### 2. Setting Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable:
   - Name: `AUSPOST_API_KEY`, Value: `your_actual_api_key`
   - Name: `RAZORPAY_KEY_ID`, Value: `your_razorpay_key_id`
   - Name: `RAZORPAY_KEY_SECRET`, Value: `your_razorpay_secret`
   - Name: `NODE_ENV`, Value: `production`

### 3. Deployment Commands

```bash
# Install Vercel CLI globally (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel

# For production deployment
vercel --prod
```

### 4. Project Structure

The deployment is configured to:
- Serve the frontend from the `dist` folder
- Route `/api/*` requests to the backend server
- Use Node.js 18.x runtime for the backend

### 5. API Endpoints

After deployment, your API will be available at:
- `https://your-domain.vercel.app/api/auspost/sizes`
- `https://your-domain.vercel.app/api/auspost/services`
- `https://your-domain.vercel.app/api/auspost/calc`
- `https://your-domain.vercel.app/api/parcel/*`
- `https://your-domain.vercel.app/api/payment/*`

### 6. Testing the Deployment

After deployment, test your API endpoints:
```bash
curl https://your-domain.vercel.app/api/auspost/sizes
```

### 7. Troubleshooting

- Check Vercel function logs in the dashboard
- Ensure all environment variables are set correctly
- Verify that your API keys are valid and have proper permissions
- Check that the backend dependencies are properly installed

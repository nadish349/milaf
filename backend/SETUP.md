# 🚀 Milaf Arabia Backend Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
The `.env` file is already configured with your Australian Post API key:
```env
AUSPOST_API_KEY=aad38b44-e83f-4b79-8dfa-861f9761a495
PORT=5000
```

### 3. Start the Server
```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

### 4. Test the API
```bash
# Run API tests
npm test

# Or manually test
curl http://localhost:5000
```

## API Endpoints

### Health Check
```bash
curl http://localhost:5000
```

### Get Services
```bash
curl http://localhost:5000/api/services
```

### Calculate Shipping
```bash
curl "http://localhost:5000/api/calculate?from=3000&to=2000&length=22&width=16&height=7.7&weight=1.5"
```

## Frontend Integration

### 1. Update Frontend Environment
Add to your frontend `.env`:
```env
VITE_BACKEND_URL=http://localhost:5000
```

### 2. Create Shipping Service
Create `src/services/shippingService.ts`:
```typescript
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const getShippingServices = async () => {
  const response = await fetch(`${BACKEND_URL}/api/services`);
  return response.json();
};

export const calculateShipping = async (params: {
  from: string;
  to: string;
  length: number;
  width: number;
  height: number;
  weight: number;
}) => {
  const queryParams = new URLSearchParams(params as any);
  const response = await fetch(`${BACKEND_URL}/api/calculate?${queryParams}`);
  return response.json();
};
```

### 3. Use in Components
```typescript
import { calculateShipping } from '@/services/shippingService';

const shippingOptions = await calculateShipping({
  from: '3000',
  to: '2000', 
  length: 22,
  width: 16,
  height: 7.7,
  weight: 1.5
});
```

## Troubleshooting

### Server Won't Start
- Check if port 5000 is available
- Verify `.env` file exists with API key
- Run `npm install` to ensure dependencies are installed

### API Errors
- Check Australian Post API key is valid
- Verify network connection
- Check server logs for detailed error messages

### CORS Issues
- Ensure frontend URL is in CORS whitelist
- Check if frontend is running on allowed port (3000, 4000, 5173)

## Production Deployment

### Environment Variables
```env
AUSPOST_API_KEY=your_production_api_key
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
```

### PM2 (Process Manager)
```bash
npm install -g pm2
pm2 start server.js --name "milaf-backend"
pm2 save
pm2 startup
```

## Support

For issues or questions:
1. Check server logs
2. Verify API key validity
3. Test with provided test script
4. Check Australian Post API documentation

















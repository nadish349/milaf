# JWT Authentication Setup

This project now includes JWT (JSON Web Token) authentication to secure all routes with a 24-hour token expiration.

## Features Implemented

### 🔐 JWT Token System
- **24-hour token expiration** - Tokens automatically expire after 24 hours
- **Automatic token refresh** - Tokens are refreshed when close to expiring (within 1 hour)
- **Secure storage** - Tokens stored in localStorage with validation
- **Token validation** - All protected routes verify JWT tokens

### 🛡️ Protected Routes
- **Cart** - Requires authentication
- **My Orders** - Requires authentication  
- **Bulk Order** - Requires authentication
- **Payment** - Requires authentication
- **Checkpoint** - Requires authentication
- **Business Inquiry** - Public (no authentication required)
- **Home** - Public (no authentication required)

### 🔄 Authentication Flow
1. User logs in with Firebase Auth
2. JWT token is automatically generated and stored
3. Token is included in all API requests
4. Token is automatically refreshed when needed
5. User is logged out when token expires

## Configuration

### Environment Variables
Create a `.env` file in your project root with:

```env
# JWT Configuration
VITE_JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# API Configuration (optional)
VITE_API_URL=http://localhost:3001/api
```

**Note**: Vite uses `VITE_` prefix for environment variables instead of `REACT_APP_`.

### Dependencies
The JWT system uses the `jose` library for browser-compatible JWT operations:
```bash
npm install jose
```

### Security Notes
- **Change the JWT secret** in production to a strong, random string
- **Use HTTPS** in production for secure token transmission
- **Consider token rotation** for enhanced security
- **Browser-compatible** - Uses `jose` library instead of Node.js `jsonwebtoken`

## Files Added/Modified

### New Files:
- `src/services/jwtService.ts` - JWT token management
- `src/components/ProtectedRoute.tsx` - Route protection component
- `src/services/apiService.ts` - Authenticated API requests
- `src/hooks/useTokenRefresh.ts` - Automatic token refresh
- `src/components/LoginPrompt.tsx` - Login prompt for protected routes

### Modified Files:
- `src/contexts/AuthContext.tsx` - Added JWT integration
- `src/App.tsx` - Added protected routes
- `src/pages/Index.tsx` - Added login prompt
- `src/mobilepages/Index.tsx` - Added login prompt

## Usage

### For Developers:
```typescript
import { JWTService } from '@/services/jwtService';
import { ApiService } from '@/services/apiService';

// Check if user is authenticated
const isAuthenticated = JWTService.getCurrentUser() !== null;

// Make authenticated API request
const response = await ApiService.get('/protected-endpoint');
```

### For Users:
1. **Login required** - Users must log in to access cart, orders, and checkout
2. **Automatic login** - JWT tokens keep users logged in for 24 hours
3. **Secure access** - All sensitive operations require valid authentication

## Security Benefits

✅ **Route Protection** - Unauthorized users cannot access sensitive pages
✅ **Token Expiration** - Automatic logout after 24 hours for security
✅ **API Security** - All API requests include authentication tokens
✅ **User Experience** - Seamless login flow with automatic token management
✅ **Data Protection** - User data is only accessible to authenticated users

## Testing

1. **Try accessing protected routes without login** - Should redirect to home with login prompt
2. **Login and access protected routes** - Should work normally
3. **Wait 24 hours or manually expire token** - Should require re-login
4. **Check browser localStorage** - Should see `jwt_token` key with encrypted token

### JWT Service Testing
You can test the JWT service functionality in the browser console:
```javascript
// Import and run the test
import { testJWTService } from './src/utils/jwtTest';
testJWTService();

// Or use the global function
window.testJWTService();
```

This will test:
- Token generation
- Token storage and retrieval
- Token verification
- Token expiration checking
- Token refresh functionality

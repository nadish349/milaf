# Milaf Arabia Backend API

Backend API for Milaf Arabia e-commerce platform with Australian Post shipping integration.

## Features

- 🚀 Express.js server with modern ES6+ syntax
- 📦 Australian Post API integration
- 🌐 CORS enabled for frontend communication
- ✅ Input validation and error handling
- 📊 Structured JSON responses
- 🔧 Environment variable configuration

## API Endpoints

### Health Check
```
GET /
```
Returns server status and information.

### Get Available Services
```
GET /api/services
```
Fetches available Australian Post parcel services.

**Response:**
```json
{
  "success": true,
  "data": {
    "postage_result": {
      "service": [
        {
          "code": "AUS_PARCEL_REGULAR",
          "name": "Parcel Post",
          "price": "12.20"
        }
      ]
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Calculate Shipping Cost
```
GET /api/calculate?from=3000&to=2000&length=22&width=16&height=7.7&weight=1.5
```

**Parameters:**
- `from` - Origin postcode
- `to` - Destination postcode  
- `length` - Package length (cm)
- `width` - Package width (cm)
- `height` - Package height (cm)
- `weight` - Package weight (kg)

**Response:**
```json
{
  "success": true,
  "data": {
    "postage_result": {
      "service": [
        {
          "code": "AUS_PARCEL_REGULAR",
          "name": "Parcel Post",
          "price": "12.20"
        },
        {
          "code": "AUS_PARCEL_EXPRESS",
          "name": "Express Post", 
          "price": "15.85"
        }
      ]
    }
  },
  "parameters": {
    "from_postcode": "3000",
    "to_postcode": "2000",
    "length": 22,
    "width": 16,
    "height": 7.7,
    "weight": 1.5
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Calculate Cost for Specific Service
```
GET /api/calculate/AUS_PARCEL_EXPRESS?from=3000&to=2000&length=22&width=16&height=7.7&weight=1.5
```

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your Australian Post API key
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Start production server:**
   ```bash
   npm start
   ```

## Environment Variables

```env
# Australian Post API Configuration
AUSPOST_API_KEY=your_api_key_here

# Server Configuration  
PORT=5000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:4000
```

## Development

- **Development:** `npm run dev` (with nodemon)
- **Production:** `npm start`
- **Port:** 5000 (configurable via PORT env var)

## Error Handling

All endpoints return structured JSON responses:

**Success:**
```json
{
  "success": true,
  "data": {...},
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed error message",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## CORS

CORS is configured to allow requests from:
- `http://localhost:3000`
- `http://localhost:4000` 
- `http://localhost:5173`

## License

MIT
















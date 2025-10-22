import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables first
dotenv.config({ path: join(__dirname, '.env') });

// Set environment variables explicitly for all modules
process.env.RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_hR7AnaghyZb2Kx';
process.env.RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'dz3eMDJg0x2BBacee9U9tbQI';
process.env.AUSPOST_API_KEY = process.env.AUSPOST_API_KEY || 'aad38b44-e83f-4b79-8dfa-861f9761a495';

// Debug environment variables
console.log('🔍 Environment check:', {
  AUSPOST_API_KEY: process.env.AUSPOST_API_KEY ? 'SET' : 'MISSING',
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID ? 'SET' : 'MISSING',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET ? 'SET' : 'MISSING'
});

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

const API_KEY = process.env.AUSPOST_API_KEY || 'aad38b44-e83f-4b79-8dfa-861f9761a495';
const BASE = 'https://digitalapi.auspost.com.au/postage/parcel/domestic';

// Debug
console.log("🔑 Loaded API Key:", API_KEY ? API_KEY.substring(0, 8) + "... (hidden)" : "❌ Not found");

// Helper using native fetch with robust content checks
async function fetchAusPost(url) {
  const result = await fetch(url, { headers: { 'auth-key': API_KEY, 'Accept': 'application/json' } });
  const contentType = result.headers.get('content-type') || '';
  const text = await result.text();
  if (!contentType.includes('application/json')) {
    const snippet = text.slice(0, 300);
    throw new Error(`AusPost returned non-JSON (status ${result.status}). First bytes: ${snippet}`);
  }
  let data;
  try { data = JSON.parse(text); }
  catch { throw new Error(`Invalid JSON from AusPost: ${text.slice(0, 300)}`); }
  if (!result.ok) throw new Error(data?.error?.errorMessage || `AusPost HTTP ${result.status}`);
  return data;
}

// Get parcel sizes
app.get('/api/auspost/sizes', async (req, res) => {
  try {
    const data = await fetchAusPost(`${BASE}/size.json`);
    res.json(data);
  } catch (err) {
    console.error("❌ Sizes Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get services
app.get('/api/auspost/services', async (req, res) => {
  try {
    const params = new URLSearchParams(req.query).toString();
    const data = await fetchAusPost(`${BASE}/service.json?${params}`);
    res.json(data);
  } catch (err) {
    console.error("❌ Services Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Calculate postage
app.get('/api/auspost/calc', async (req, res) => {
  try {
    const params = new URLSearchParams(req.query).toString();
    const data = await fetchAusPost(`${BASE}/calculate.json?${params}`);
    res.json(data);
  } catch (err) {
    console.error("❌ Calc Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Routes
import parcelController from './controllers/parcelController.js';
app.use('/api/parcel', parcelController);

// Payment routes
import paymentController from './controllers/paymentController.js';
app.use('/api/payment', paymentController);

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
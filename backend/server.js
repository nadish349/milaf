import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8054;

app.use(cors());

const API_KEY = process.env.AUSPOST_API_KEY;
const BASE = 'https://digitalapi.auspost.com.au/postage/parcel/domestic';

// Debug
console.log("🔑 Loaded API Key:", API_KEY ? API_KEY.substring(0, 8) + "... (hidden)" : "❌ Not found");

// Helper using native fetch
async function fetchAusPost(url) {
  const result = await fetch(url, { headers: { 'auth-key': API_KEY } });
  const text = await result.text();
  let data;
  try { data = JSON.parse(text); } 
  catch { throw new Error(`Invalid JSON from AusPost: ${text}`); }
  if (!result.ok) throw new Error(data?.error?.errorMessage || "Unknown AusPost error");
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

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
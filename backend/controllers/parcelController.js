import express from 'express';

const router = express.Router();

const API_KEY = process.env.AUSPOST_API_KEY;
const BASE = 'https://digitalapi.auspost.com.au/postage/parcel/domestic';

// Default parcel configuration
const DEFAULT_FROM_POSTCODE = '2170';
const DEFAULT_PARCEL = {
  length: 44.5,
  width: 32,
  height: 14.5,
  weight: 6,
};

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

// GET /api/parcel/services?to_postcode=XXXX
router.get('/services', async (req, res) => {
  try {
    const to_postcode = String(req.query.to_postcode || '').trim();
    if (!to_postcode) return res.status(400).json({ error: 'to_postcode is required' });

    console.log(`🔍 Fetching services for postcode: ${to_postcode}`);

    const params = new URLSearchParams({
      from_postcode: DEFAULT_FROM_POSTCODE,
      to_postcode,
      length: String(req.query.length || DEFAULT_PARCEL.length),
      width: String(req.query.width || DEFAULT_PARCEL.width),
      height: String(req.query.height || DEFAULT_PARCEL.height),
      weight: String(req.query.weight || DEFAULT_PARCEL.weight),
    }).toString();

    const url = `${BASE}/service.json?${params}`;
    console.log(`📡 AusPost URL: ${url}`);
    
    const data = await fetchAusPost(url);
    console.log(`✅ Services response:`, JSON.stringify(data, null, 2));
    res.json(data);
  } catch (err) {
    console.error('❌ Parcel Services Error:', err.message);
    console.error('❌ Full error:', err);
    res.status(500).json({ 
      error: err.message,
      details: 'Check server logs for AusPost API response'
    });
  }
});

// GET /api/parcel/calc?to_postcode=XXXX&service_code=AUS_SERVICE
router.get('/calc', async (req, res) => {
  try {
    const to_postcode = String(req.query.to_postcode || '').trim();
    const service_code = String(req.query.service_code || '').trim();
    if (!to_postcode) return res.status(400).json({ error: 'to_postcode is required' });
    if (!service_code) return res.status(400).json({ error: 'service_code is required' });

    console.log(`🔍 Calculating for postcode: ${to_postcode}, service: ${service_code}`);

    const params = new URLSearchParams({
      from_postcode: DEFAULT_FROM_POSTCODE,
      to_postcode,
      service_code,
      length: String(req.query.length || DEFAULT_PARCEL.length),
      width: String(req.query.width || DEFAULT_PARCEL.width),
      height: String(req.query.height || DEFAULT_PARCEL.height),
      weight: String(req.query.weight || DEFAULT_PARCEL.weight),
    }).toString();

    const url = `${BASE}/calculate.json?${params}`;
    console.log(`📡 AusPost Calc URL: ${url}`);
    
    const data = await fetchAusPost(url);
    console.log(`✅ Calc response:`, JSON.stringify(data, null, 2));
    res.json(data);
  } catch (err) {
    console.error('❌ Parcel Calc Error:', err.message);
    console.error('❌ Full error:', err);
    res.status(500).json({ 
      error: err.message,
      details: 'Check server logs for AusPost API response'
    });
  }
});

export default router;



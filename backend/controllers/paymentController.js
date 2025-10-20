import express from 'express';
import crypto from 'crypto';

const router = express.Router();

// Temporary hardcoded values for testing
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_hR7AnaghyZb2Kx';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'dz3eMDJg0x2BBacee9U9tbQI';

console.log('🔑 Razorpay Keys:', {
  keyId: RAZORPAY_KEY_ID ? RAZORPAY_KEY_ID.substring(0, 8) + '...' : 'MISSING',
  keySecret: RAZORPAY_KEY_SECRET ? 'SET' : 'MISSING'
});

// Basic input validation helpers
function isPositiveInt(n) {
  return Number.isInteger(n) && n > 0;
}

function toMinorUnitsINR(amountMajor) {
  // Razorpay uses paise; round to integer
  return Math.round(amountMajor * 100);
}

// Reuse AusPost helper behavior via direct request to controller endpoints
async function fetchAuspostShipping(to_postcode) {
  const res = await fetch(`http://localhost:4000/api/parcel/calc?to_postcode=${encodeURIComponent(to_postcode)}&service_code=AUS_PARCEL_REGULAR`);
  const json = await res.json();
  if (!res.ok || json?.error) throw new Error(json?.error || 'Shipping calculation failed');
  const cost = Number(json?.postage_result?.total_cost || 0);
  return { amount: isNaN(cost) ? 0 : cost, result: json?.postage_result };
}

// This should be replaced with a real product price lookup
function computeItemsTotal(cartItems = []) {
  let sum = 0;
  for (const item of cartItems) {
    const price = Number(item.price); // assume client sent price; in prod, fetch canonical price by id
    const qty = Number(item.quantity || 1);
    if (!isNaN(price) && !isNaN(qty)) sum += price * qty;
  }
  return sum;
}

// GET /api/payment/key
router.get('/key', (req, res) => {
  if (!RAZORPAY_KEY_ID) return res.status(500).json({ error: 'Missing RAZORPAY_KEY_ID' });
  res.json({ key: RAZORPAY_KEY_ID });
});

// POST /api/payment/create-order
router.post('/create-order', express.json(), async (req, res) => {
  try {
    const { cartItems, zipcode } = req.body || {};
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: 'cartItems is required' });
    }
    if (!zipcode) return res.status(400).json({ error: 'zipcode is required' });

    const itemsTotal = computeItemsTotal(cartItems);
    const { amount: shippingAmount } = await fetchAuspostShipping(String(zipcode));

    // Optional: compute taxes
    const tax = 0;

    // Calculate real total with shipping
    const grandTotal = itemsTotal + shippingAmount + tax;
    console.log(`💰 Real total calculation: Items: $${itemsTotal} + Shipping: $${shippingAmount} + Tax: $${tax} = $${grandTotal}`);

    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ error: 'Razorpay keys not configured' });
    }

    const orderPayload = {
      amount: toMinorUnitsINR(grandTotal),
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
      notes: { zipcode: String(zipcode) }
    };

    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64')
      },
      body: JSON.stringify(orderPayload)
    });
    const orderJson = await response.json();
    if (!response.ok) return res.status(502).json({ error: orderJson?.error?.description || 'Failed to create Razorpay order' });

    // Return order info to client
    res.json({
      orderId: orderJson.id,
      amount: orderJson.amount,
      currency: orderJson.currency
    });
  } catch (err) {
    console.error('❌ create-order error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/payment/verify
router.post('/verify', express.json(), async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing verification fields' });
    }
    const hmac = crypto.createHmac('sha256', RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const expected = hmac.digest('hex');
    const valid = expected === razorpay_signature;
    if (!valid) return res.status(400).json({ error: 'Invalid payment signature' });
    // TODO: mark order as paid in DB
    res.json({ status: 'ok' });
  } catch (err) {
    console.error('❌ verify error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/payment/webhook
router.post('/webhook', express.raw({ type: '*/*' }), async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    if (!signature) return res.status(400).send('Missing signature');
    const body = req.body; // raw buffer
    const computed = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');
    if (computed !== signature) return res.status(400).send('Invalid signature');
    // TODO: parse event, update order status idempotently
    res.status(200).send('ok');
  } catch (err) {
    console.error('❌ webhook error:', err.message);
    res.status(500).send('error');
  }
});

export default router;



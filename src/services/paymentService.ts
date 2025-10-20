export async function loadRazorpay(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  if (document.getElementById('razorpay-sdk')) return true;
  await new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.id = 'razorpay-sdk';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
    document.body.appendChild(script);
  });
  return true;
}

export async function createOrder(baseUrl: string, token: string, payload: any) {
  const res = await fetch(`${baseUrl}/api/payment/create-order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error || 'Failed to create order');
  return json;
}

export async function getPublicKey(baseUrl: string) {
  const res = await fetch(`${baseUrl}/api/payment/key`);
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error || 'Failed to load payment key');
  return json.key as string;
}

export async function verifyPayment(baseUrl: string, token: string, payload: any) {
  const res = await fetch(`${baseUrl}/api/payment/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error || 'Payment verification failed');
  return json;
}



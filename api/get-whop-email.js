// api/get-whop-email.js
//
// Rate My Exes (EN) no longer collects email in the form — instead, once
// Whop's embedded checkout fires onComplete(planId, receiptId), the
// frontend calls this endpoint with the receiptId to pull the buyer's
// email straight from Whop's payment record.
//
// Requires WHOP_API_KEY in Vercel env vars (Account API key with at least
// payment:basic:read + member:email:read permissions — same key referenced
// in the webhook scopes docs). Get it from Whop dashboard > Developer > API Keys.
//
// Docs: https://docs.whop.com/api-reference/payments/retrieve-payment
// (Verify the exact path/shape against current Whop docs if this starts failing —
// Whop has both a /v5/payments/{id} and /v5/app/payments/{id} variant depending
// on key scope, so this may need a one-line URL tweak.)

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { receiptId } = req.body || {};
  if (!receiptId) return res.json({ email: null });

  const apiKey = process.env.WHOP_API_KEY;
  if (!apiKey) {
    console.error('[get-whop-email] WHOP_API_KEY not set');
    return res.json({ email: null });
  }

  try {
    const whopRes = await fetch(`https://api.whop.com/api/v5/payments/${receiptId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!whopRes.ok) {
      console.error('[get-whop-email] Whop API error', whopRes.status, await whopRes.text());
      return res.json({ email: null });
    }

    const payment = await whopRes.json();
    const email = payment?.user?.email || payment?.member?.email || null;

    return res.json({ email });
  } catch (e) {
    console.error('[get-whop-email] fetch failed', e);
    return res.json({ email: null }); // fail soft — checkout already succeeded, don't block the flow
  }
};

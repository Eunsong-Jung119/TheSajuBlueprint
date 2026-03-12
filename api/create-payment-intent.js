const Stripe = require('stripe');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Predefined discount codes (same as frontend)
const DISCOUNT_CODES = {
  'TEST100': 100,
  'LAUNCH50': 50,
  'FRIEND30': 30,
  'COSMIC20': 20,
};

const BASE_PRICE_CENTS = 999; // $9.99

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { discountCode, email, name } = req.body;

  // Calculate final amount
  let amountCents = BASE_PRICE_CENTS;
  let discountPct = 0;

  if (discountCode && DISCOUNT_CODES[discountCode.toUpperCase()]) {
    discountPct = DISCOUNT_CODES[discountCode.toUpperCase()];
    amountCents = Math.round(BASE_PRICE_CENTS * (1 - discountPct / 100));
  }

  // Minimum $0.50 for Stripe
  if (amountCents < 50) amountCents = 50;

  try {
    // Create a unique orderId
    const orderId = `saju_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: 'usd',
      receipt_email: email,
      metadata: {
        orderId,
        customerName: name,
        discountCode: discountCode || '',
        discountPct: String(discountPct),
      },
      description: 'The Saju Blueprint — Personal Destiny Report',
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      orderId,
    });

  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ error: err.message });
  }
};

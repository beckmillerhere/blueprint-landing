// Vercel Serverless Function - Stripe Checkout Session Creator
// This will be deployed automatically when you deploy to Vercel
// No server setup needed - Vercel handles it all

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'The Beck Miller Blueprint',
              description: '13 chapters. The operating system for building something that matters.',
            },
            unit_amount: 4900, // $49.00 in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/blueprint-delivery.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/blueprint-landing.html`,
      
      // Optional: collect customer email for delivery
      customer_email: req.body.email || undefined,
      
      // Optional: metadata for tracking
      metadata: {
        product: 'beck-miller-blueprint',
      },
    });

    // Return session ID to frontend
    res.status(200).json({ id: session.id });
    
  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ error: err.message });
  }
}

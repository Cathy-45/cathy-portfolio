
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const nodemailer = require('nodemailer');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();
app.use(cors());
app.use('/api/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());
async function initializeDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'cathy_portfolio',
  });
  console.log('Connected to MySQL database.');
  return connection;
}
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
app.post('/api/consultations', async (req, res) => {
  const { name, email, phone, message } = req.body;
  console.log('Received data:', req.body);
  if (!name || !email) {
    console.log('Validation failed: Missing name or email');
    return res.status(400).json({ error: 'Name and email are required' });
  }
  let connection;
  try {
    const connection = await initializeDatabase();

    const query =
      'INSERT INTO consultations (name, email, phone, message, created_at) VALUES (?, ?, ?, ?, NOW())';
    const [result] = await connection.execute(query, [name, email, phone, message]);
    console.log('Insert result:', result);
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Consultation Request Received',
      text: `Dear ${name},\n\nThank you for your consultation request!\n\nDetails:\nPhone: ${
        phone || 'Not provided'
      }\nMessage: ${
        message || 'Not provided'
      }\n\nI will get back to you soon.\n\nBest regards,\nCathy`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email error:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
    res.status(201).json({
      message: 'Consultation request submitted successfully',
      data: { id: result.insertId, name, email, phone, message },
    });

  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Server error' });
  } finally {
    if (connection) await connection.end();
  }
});


app.post('/api/payments', async (req, res) => {
  const { name, email, amount } = req.body;
  console.log('Received payment request:', { name, email, amount });
  if (!name || !email || !amount) {
    console.log('Validation failed: Missing name, email, or amount');
    return res
      .status(400)
      .json({ error: 'Name, email, and amount are required' });
  }
  let connection;
  try {
    connection = await initializeDatabase();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: 'Consultation Fee' },
          unit_amount: Math.round(parseFloat(amount) * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: 'https://cathy-portfolio-frontend.onrender.com/success',
      cancel_url: 'https://cathy-portfolio-frontend.onrender.com/consultation',
      customer_email: email,
      metadata: { name, email, consultation_id: '' },
    });



    console.log('Stripe session created:', { sessionId: session.id, paymentIntent: session.payment_intent });

    
    const selectQuery = 'SELECT id, created_at FROM consultations WHERE email = ? ORDER BY created_at DESC LIMIT 1';
    const [results] = await connection.execute(selectQuery, [email]);
    if (!results || results.length === 0) {
      console.error('No matching consultation found for email:', email);
      return res.status(404).json({ error: 'No matching consultation found' });
    }

    const { id } = results[0];
    console.log('Selected consultation:', { id, email });
    const updateQuery =
      'UPDATE consultations SET session_id = ? WHERE id = ?';
    const [updateResult] = await connection.execute(updateQuery, [session.id, id]);

    const { id, created_at } = results[0];
    console.log('Selected consultation:', { id, created_at, email });
    const updateQuery =
      'UPDATE consultations SET payment_intent_id = ?, payment_status = ? WHERE id = ?';
    const [updateResult] = await connection.execute(updateQuery, [session.payment_intent, session.payment_status, id]);

    console.log('Database update result:', updateResult);
    if (updateResult.affectedRows === 0) {
      console.error('No rows updated for id:', id);
      return res.status(500).json({ error: 'Failed to update consultation' });
    }
    res.json({ id: session.id });


  } catch (error) {
    console.error('Error in /api/payments:', error);
    res.status(500).json({ error: 'Payment initiation failed' });
  } finally {
    if (connection) await connection.end();
  }
});

app.post('/api/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { email } = session.metadata;
    console.log('Webhook received: checkout.session.completed', { sessionId: session.id, paymentIntent: session.payment_intent });
    let connection;
    try {
      connection = await initializeDatabase();
      const updateQuery =
        'UPDATE consultations SET payment_intent_id = ?, payment_status = ? WHERE session_id = ?';
      const [updateResult] = await connection.execute(updateQuery, [session.payment_intent, 'paid', session.id]);
      console.log('Webhook database update result:', updateResult);
      if (updateResult.affectedRows === 0) {
        console.error('No rows updated for session_id:', session.id);
      }
    } catch (err) {
      console.error('Webhook database error:', err);
    } finally {
      if (connection) await connection.end();
    }
  }
  res.json({ received: true });
});
app.listen(process.env.PORT || 5003, () => console.log(`Server running on port ${process.env.PORT || 5003}`));


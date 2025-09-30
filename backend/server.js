require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const nodemailer = require('nodemailer');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const url = require('url');
const app = express();

// Use cors for all routes
app.use(cors());

// Webhook route must use raw body and be isolated
app.post('/api/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log('Webhook received: checkout.session.completed', { sessionId: session.id, fullSession: session });

    (async () => {
      let connection;
      try {
        connection = await initializeDatabase();
        const [rows] = await connection.execute('SELECT * FROM consultations WHERE session_id = ?', [session.id]);
        console.log('Matching consultations:', rows);

        if (rows.length === 0) {
          console.error('No consultation found for session_id:', session.id);
          // Fix: Include required fields with defaults
          const [insertResult] = await connection.execute(
            'INSERT INTO consultations (name, email, session_id, created_at) VALUES (?, ?, ?, NOW())',
            ['Test User', session.customer_email || 'test@stripe.com', session.id]
          );
          console.log('Created fallback consultation:', insertResult);
        } else {
          const updateQuery = 'UPDATE consultations SET payment_intent_id = ?, payment_status = ? WHERE session_id = ?';
          const [updateResult] = await connection.execute(updateQuery, [session.payment_intent, 'paid', session.id]);
          console.log('Webhook database update result:', updateResult);
          if (updateResult.affectedRows === 0) {
            console.error('No rows updated for session_id:', session.id);
          }
        }
      } catch (err) {
        console.error('Webhook database error:', err);
      } finally {
        if (connection) await connection.end();
      }
    })();
  }
  res.json({ received: true });
});

// JSON parsing for other routes
app.use(express.json());

async function initializeDatabase() {
  let connectionConfig = {
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'railway',
    port: process.env.MYSQL_PORT || 3306,
    ssl: process.env.MYSQL_HOST?.includes('railway.app') ? { rejectUnauthorized: false } : undefined,
    connectTimeout: 10000, // Valid for createConnection
  };

  if (process.env.MYSQL_URL) {
    const parsedUrl = url.parse(process.env.MYSQL_URL);
    const [user, password] = parsedUrl.auth ? parsedUrl.auth.split(':') : ['', ''];
    connectionConfig = {
      host: parsedUrl.hostname,
      user: user || 'root',
      password: password || '',
      database: parsedUrl.pathname ? parsedUrl.pathname.split('/')[1] : 'railway',
      port: parsedUrl.port || 3306,
      ssl: parsedUrl.hostname?.includes('railway.app') ? { rejectUnauthorized: false } : undefined,
      connectTimeout: 10000, // Valid for createConnection
    };
  }

  const connection = await mysql.createConnection(connectionConfig);
  console.log('Connected to MySQL database.');
  return connection;
}

// Test database connection at startup
(async () => {
  let connection;
  let retries =3;
  while(retries > 0){
  try {
    connection = await initializeDatabase();
    console.log('Startup: Successfully connected to MySQL database.');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS consultations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        message TEXT,
        created_at DATETIME NOT NULL,
        payment_intent_id VARCHAR(255),
        session_id VARCHAR(255) UNIQUE,
        payment_status VARCHAR(20)
      )
    `);
break;
  } catch (err) {
console.error(`Startup: Failed to connect to MySQL database (attempt ${4 - retries}):`, err);
      retries--;
      if (retries === 0) {
        console.error('Startup: All connection attempts failed. Exiting.');
        process.exit(1);
      }
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds before retry
    } finally {
      if (connection) await connection.end();
    }
  }
})();

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
    connection = await initializeDatabase();
    const query = 'INSERT INTO consultations (name, email, phone, message, created_at) VALUES (?, ?, ?, ?, NOW())';
    const [result] = await connection.execute(query, [name, email, phone, message]);
    console.log('Insert result:', result);
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Consultation Request Received',
      text: `Dear ${name},\n\nThank you for your consultation request!\nDetails:\nName: ${name}\nEmail: ${email}\nPhone: ${
        phone || 'Not provided'
      }\nMessage: ${message || 'Not provided'}\n\nI will get back to you soon.\n\nBest regards,\nCathy`,
    };
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
    res.status(201).json({
      message: 'Consultation request submitted successfully',
      data: { id: result.insertId, name, email, phone, message },
    });
  } catch (err) {
    console.error('Database or email error:', err);
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
    return res.status(400).json({ error: 'Name, email, and amount are required' });
  }
  let connection;
  try {
    connection = await initializeDatabase();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'Consultation Fee' },
            unit_amount: Math.round(parseFloat(amount) * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://frontend-df5v.onrender.com/success',
      cancel_url: 'https://frontend-df5v.onrender.com/consultation',
      customer_email: email,
      metadata: { name, email, consultation_id: '' },
    });
    console.log('Stripe session created:', { sessionId: session.id, paymentIntent: session.payment_intent });
    const selectQuery = 'SELECT id FROM consultations WHERE email = ? ORDER BY created_at DESC LIMIT 1';
    const [results] = await connection.execute(selectQuery, [email]);
    if (!results || results.length === 0) {
      console.error('No matching consultation found for email:', email);
      return res.status(404).json({ error: 'No matching consultation found' });
    }
    const { id } = results[0];
    console.log('Selected consultation:', { id, email });
    const updateQuery = 'UPDATE consultations SET session_id = ? WHERE id = ?';
    const [updateResult] = await connection.execute(updateQuery, [session.id, id]);
    console.log('Database update result:', updateResult);
    if (updateResult.affectedRows === 0) {
      console.error('No rows updated for id:', id);
      return res.status(500).json({ error: 'Failed to update consultation' });
    }
    res.json({ id: session.id, url: session.url});
  } catch (error) {
    console.error('Error in /api/payments:', error);
    res.status(500).json({ error: 'Payment initiation failed', details: error.message });
  } finally {
    if (connection) await connection.end();
  }
});

app.listen(process.env.PORT || 5003, () => console.log(`Server running on port ${process.env.PORT || 5003}`));

require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const nodemailer = require('nodemailer');
const mysql = require('mysql2/promise');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const url = require('url');

// Global uncaught exception handler
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Webhook route (must come before express.json())
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
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
    console.log('Webhook received: checkout.session.completed', { sessionId: session.id });
    const pool = await initializeDatabase();
    let connection;
    try {
      connection = await pool.getConnection();
      const [rows] = await connection.execute('SELECT * FROM consultations WHERE session_id = ?', [session.id]);
      console.log('Matching consultations before update:', rows);
      if (rows.length === 0) {
        const [insertResult] = await connection.execute(
          'INSERT INTO consultations (name, email, session_id, created_at) VALUES (?, ?, ?, NOW())',
          ['Test User', session.customer_email || 'test@stripe.com', session.id]
        );
        console.log('Created fallback consultation:', insertResult);
      } else {
        const [updateResult] = await connection.execute(
          'UPDATE consultations SET payment_intent_id = ?, payment_status = ? WHERE session_id = ?',
          [session.payment_intent, 'paid', session.id]
        );
        console.log('Webhook database update result:', updateResult);
        const [updatedRows] = await connection.execute('SELECT * FROM consultations WHERE session_id = ?', [session.id]);
        console.log('Updated consultation state:', updatedRows);
      }
    } catch (err) {
      console.error('Webhook database error:', err);
    } finally {
      if (connection) connection.release();
    }
  }
  res.json({ received: true });
});

// Use express.json() after webhook to parse other routes
app.use(express.json());
app.use(cors({
  origin: 'https://frontend-df5v.onrender.com', // Match your frontend URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

async function initializeDatabase() {
  console.log('Initializing database with environment at:', new Date().toISOString());
  let connectionConfig = {
    host: process.env.MYSQL_HOST || 'centerbeam.proxy.rlwy.net',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'qMDhdbiwMxqvqkgycKcpvVAeXxpRzfDR',
    database: process.env.MYSQL_DATABASE || 'railway',
    port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT) : 32327,
    ssl: process.env.MYSQL_HOST?.includes('railway.app') ? { rejectUnauthorized: false } : undefined,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 180000,
  };

  if (process.env.MYSQL_URL) {
    console.log('Using MYSQL_URL at:', new Date().toISOString(), process.env.MYSQL_URL);
    const parsedUrl = url.parse(process.env.MYSQL_URL);
    const [user, password] = parsedUrl.auth ? parsedUrl.auth.split(':') : ['', ''];
    connectionConfig = {
      host: parsedUrl.hostname || 'centerbeam.proxy.rlwy.net',
      user: user || 'root',
      password: password || 'qMDhdbiwMxqvqkgycKcpvVAeXxpRzfDR',
      database: parsedUrl.pathname ? parsedUrl.pathname.split('/')[1] || 'railway' : 'railway',
      port: parsedUrl.port ? parseInt(parsedUrl.port) : 32327,
      ssl: parsedUrl.hostname?.includes('railway.app') ? { rejectUnauthorized: false } : undefined,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 180000,
    };
  }

  let retries = 20;
  const startTime = Date.now();
  while (retries > 0) {
    try {
      pool = await mysql.createPool(connectionConfig);
      console.log('Attempting MySQL connection with config at:', new Date().toISOString(), connectionConfig);
      const connection = await pool.getConnection();
      try {
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
        await connection.query(`
          CREATE TABLE IF NOT EXISTS visits (
            id INT AUTO_INCREMENT PRIMARY KEY,
            ip VARCHAR(45) NOT NULL,
            name VARCHAR(255),
            visit_time DATETIME NOT NULL,
            UNIQUE KEY unique_ip_visit (ip, visit_time)
          )
        `);
        // Add name column if it doesn't exist
        await connection.query(`
          ALTER TABLE visits
          ADD COLUMN IF NOT EXISTS name VARCHAR(255) AFTER ip
        `);
        console.log('Connected to MySQL database with pool at:', new Date().toISOString());
      } catch (queryErr) {
        console.error('Query execution error at:', new Date().toISOString(), queryErr.message, queryErr.stack);
        throw queryErr;
      } finally {
        connection.release();
      }
      break;
    } catch (err) {
      const elapsed = (Date.now() - startTime) / 1000;
      console.error(`Startup: Failed to connect to MySQL database (attempt ${21 - retries}) after ${elapsed}s:`, err.message, err.stack);
      retries--;
      if (retries === 0) {
        console.error('Startup: All connection attempts failed after', elapsed, 'seconds. Exiting.');
        process.exit(1);
      }
      await new Promise(resolve => setTimeout(resolve, 30000));
    }
  }
  if (!pool) {
    console.error('Pool initialization failed after all retries. Check environment and network.');
    process.exit(1);
  } else {
    console.log('Pool initialized successfully at:', new Date().toISOString());
  }
  return pool;
}

// Test database connection at startup
(async () => {
  let connection;
  try {
    const pool = await initializeDatabase();
    connection = await pool.getConnection();
    console.log('Startup: Successfully connected to MySQL database with pool at:', new Date().toISOString());
    await connection.query('SELECT 1'); // Simple test query
  } catch (err) {
    console.error('Startup: Failed to connect to MySQL database:', err.message, err.stack);
  } finally {
    if (connection) connection.release();
  }
})();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Middleware to track visits and revisits with names
app.use(async (req, res, next) => {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const visitTime = new Date().toISOString();
  const mysqlVisitTime = new Date(visitTime).toISOString().slice(0, 19).replace('T', ' ');
  console.log(`Visit detected from IP: ${ip} at ${visitTime}`);

  const pool = await initializeDatabase();
  let connection;
  try {
    connection = await pool.getConnection();
    let name = 'Anonymous';
    if (req.body && req.body.name) {
      name = req.body.name; // Capture name from consultation/payment requests
    }
    const [existingVisits] = await connection.execute('SELECT visit_time, name FROM visits WHERE ip = ?', [ip]);
    const isRevisit = existingVisits.length > 0;
    await connection.execute('INSERT INTO visits (ip, name, visit_time) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE visit_time = ?, name = ?', [ip, name, mysqlVisitTime, mysqlVisitTime, name]);

    const subject = isRevisit ? 'Revisit Detected' : 'New Visitor';
    const text = `${subject}\nIP: ${ip}\nName: ${name}\nTime: ${mysqlVisitTime}\nTotal visits for this IP: ${existingVisits.length + 1}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: subject,
      text: text
    }, (err) => console.log(err || `${subject.toLowerCase()} email sent`));
  } catch (err) {
    console.error('Visit tracking error:', err);
  } finally {
    if (connection) connection.release();
  }
  next();
});

// Analytics endpoint with password protection
app.get('/api/analytics', async (req, res) => {
  const password = req.query.password; // Expect ?password=yourpassword
  if (!password || password !== process.env.ANALYTICS_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const pool = await initializeDatabase();
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute(`
      SELECT ip, name, COUNT(*) as visit_count, MIN(visit_time) as first_visit, MAX(visit_time) as last_visit
      FROM visits
      GROUP BY ip, name
    `);
    console.log('Analytics data:', rows); // Debug log
    if (!rows || rows.length === 0) {
      return res.json({ unique_visitors: 0, visits: [] });
    }
    res.json({ unique_visitors: rows.length, visits: rows });
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ error: 'Failed to fetch analytics', details: err.message });
  } finally {
    if (connection) connection.release();
  }
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
    const pool = await initializeDatabase();
    connection = await pool.getConnection();
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
    if (connection) connection.release();
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
    const pool = await initializeDatabase();
    connection = await pool.getConnection();

    let clientIP = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (clientIP.includes(',')) clientIP = clientIP.split(',')[0].trim();
    console.log('Client IP:', clientIP);

    let countryCode = 'US'; // Default to US
    try {
      const axios = require('axios');
      const response = await axios.get(`https://ipapi.co/${clientIP}/country/`, { timeout: 5000 });
      countryCode = response.data.toUpperCase();
      console.log('Detected country code:', countryCode);
    } catch (geoErr) {
      console.warn('Geolocation failed:', geoErr.message);
    }

    let finalAmount = parseFloat(amount); // Use the input amount as base
    let currency = 'usd';
    let equivalentAmount = null;
    if (countryCode === 'ZM' && parseFloat(amount) !== finalAmount) {
      finalAmount = 35.00; // Zambian pricing
      equivalentAmount = 965; // ZMW equivalent
      console.log('Adjusting to Zambian pricing: $35 USD (965 ZMW equivalent)');
    } else {
      console.log('Using requested amount:', finalAmount, 'USD');
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: { name: 'Consultation Fee' },
            unit_amount: Math.round(finalAmount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://frontend-df5v.onrender.com/success',
      cancel_url: 'https://frontend-df5v.onrender.com/consultation',
      customer_email: email,
      metadata: { 
        name, 
        email, 
        consultation_id: '', 
        country_code: countryCode,
        original_amount: amount,
        final_amount: finalAmount,
        equivalent_amount: equivalentAmount
      },
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

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Error in /api/payments:', error);
    res.status(500).json({ error: 'Payment initiation failed', details: error.message });
  } finally {
    if (connection) connection.release();
  }
});

app.listen(process.env.PORT || 5003, () => {
  const usedPort = process.env.PORT || 5003;
  console.log(`Server running on port ${usedPort} with environment port: ${process.env.PORT}`);
});
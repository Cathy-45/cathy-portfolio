

require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const nodemailer = require("nodemailer");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

db.connect((err) => {
  if (err) {
    console.error("MySQL connection error:", err);
    throw err;
  }
  console.log("Connected to MySQL database.");
});

// Nodemailer Setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// POST /api/consultations
app.post("/api/consultations", (req, res) => {
  const { name, email, phone, message } = req.body;
  console.log("Received data:", req.body);

  if (!name || !email) {
    console.log("Validation failed: Missing name or email");
    return res.status(400).json({ error: "Name and email are required" });
  }

  const query =
    "INSERT INTO consultations (name, email, phone, message, created_at) VALUES (?, ?, ?, ?, NOW())";
  db.query(query, [name, email, phone, message], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Server error" });
    }

    console.log("Insert result:", result);

    // Send confirmation email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Consultation Request Received",
      text: `Dear ${name},\n\nThank you for your consultation request!\n\nDetails:\nPhone: ${
        phone || "Not provided"
      }\nMessage: ${
        message || "Not provided"
      }\n\nI will get back to you soon.\n\nBest regards,\nCathy`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Email error:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res
      .status(201)
      .json({
        message: "Consultation request submitted successfully",
        data: result,
      });
  });
});

// POST /api/payments
app.post("/api/payments", (req, res) => {
  const { name, email, amount } = req.body;
  console.log("Received payment request:", { name, email, amount });

  if (!name || !email || !amount) {
    console.log("Validation failed: Missing name, email, or amount");
    return res
      .status(400)
      .json({ error: "Name, email, and amount are required" });
  }

  stripe.checkout.sessions
    .create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Consultation Fee" },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/consultation",
      customer_email: email,
      metadata: { name },
    })
    .then((session) => {
      const query =
        "UPDATE consultations SET payment_intent_id = ?, payment_status = ? WHERE email = ? AND name = ? AND created_at >= NOW() - INTERVAL 5 MINUTE";
      db.query(
        query,
        [session.payment_intent, session.payment_status, email, name],
        (err) => {
          if (err) {
            console.error("Database update error:", err);
          }
        }
      );
      res.json({ id: session.id });
    })
    .catch((error) => {
      console.error("Stripe error:", error);
      res.status(500).json({ error: "Payment initiation failed" });
    });
});

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require("express");
const mysql = require("mysql2");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// MySQL Connection
const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST || "localhost",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "cathy_portfolio",
});

connection.connect((err) => {
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
  connection.query(query, [name, email, phone, message], (err, result) => {
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
        data: { id: result.insertId, name, email, phone, message },
      });
  });
});

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

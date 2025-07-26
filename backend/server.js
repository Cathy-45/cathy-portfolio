const express = require("express");
const cors = require("cors");
const app = express();
// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/test", (req, res) => {
  res.json({ message: "Backend is running" });
});
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start the server
app.listen(5003, () => console.log("Server running on port 5003"));

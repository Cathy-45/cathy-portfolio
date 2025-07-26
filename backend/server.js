const express = require("express");
const cors = require("cors");
const app = express();

// Middleware to handle CORS and JSON requests
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

// Sample route to test the server
app.get("/test", (req, res) => {
  res.json({ message: "Backend is running" });
});

//error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("something broke!");
});

// Start the server
app.listen(5005, () => console.log("Server running on port 5005"));

const express = require("express");
const cors = require("cors");
const app = express();
setup-react-frontend

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
=======
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
main
});

// Start the server
app.listen(5003, () => console.log("Server running on port 5003"));

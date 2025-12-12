// src/app-gateway.js
require("dotenv").config();


const express = require("express");
const bodyParser = require("body-parser");

const otpRoutes = require("./routes/otp-routes");
const seedRoutes = require("./routes/seed-routes");

const app = express();

// Basic middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "pki-2fa-gateway" });
});

// Attach feature routes
app.use("/api/otp", otpRoutes);
app.use("/api/seed", seedRoutes);

// Port from environment or default
const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
  console.log(`PKI 2FA service listening on port ${PORT}`);
});

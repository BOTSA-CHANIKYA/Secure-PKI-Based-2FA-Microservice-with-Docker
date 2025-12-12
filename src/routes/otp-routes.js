// src/routes/otp-routes.js
const express = require("express");
const router = express.Router();
const otpEngine = require("../services/otp-engine");
const seedService = require("../services/seed-service");

// GET /api/otp/token  -> generate OTP using decrypted seed
router.get("/token", (req, res) => {
  const seed = seedService.getCachedSeed();

  if (!seed) {
    return res.status(400).json({
      error: "Seed not loaded yet. Call /api/seed/refresh first."
    });
  }

  const token = otpEngine.generateOtpToken(seed);
  res.json({ token });
});

// POST /api/otp/verify  -> verify token using decrypted seed
router.post("/verify", (req, res) => {
  const seed = seedService.getCachedSeed();
  const { token } = req.body;

  if (!seed) {
    return res.status(400).json({
      error: "Seed not loaded yet. Call /api/seed/refresh first."
    });
  }

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  const ok = otpEngine.verifyOtpToken(seed, token);
  res.json({ valid: ok });
});

// keep test endpoint
router.get("/test", (req, res) => {
  res.json({ message: "OTP route is working" });
});

module.exports = router;

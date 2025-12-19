// src/routes/otp-routes.js
const express = require("express");
const router = express.Router();
const otpEngine = require("../services/otp-engine");
const seedService = require("../services/seed-service");

// GET /api/otp/token      -> generate OTP using decrypted seed
// Also expose GET /generate-2fa as an alias.
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

// Alias for evaluator-style path: GET /generate-2fa
router.get("/generate-2fa", (req, res) => {
  const seed = seedService.getCachedSeed();

  if (!seed) {
    return res.status(400).json({
      error: "Seed not loaded yet. Call /api/seed/refresh first."
    });
  }

  const token = otpEngine.generateOtpToken(seed);
  res.json({ code: token }); // expose as "code" for verification step
});

// POST /api/otp/verify    -> verify token using decrypted seed
// Also supports POST /verify-2fa by reading "code" from body.
router.post("/verify", (req, res) => {
  const seed = seedService.getCachedSeed();
  const token = req.body.token || req.body.code; // accept either field

  if (!seed) {
    return res.status(400).json({
      error: "Seed not loaded yet. Call /api/seed/refresh first."
    });
  }

  if (!token) {
    return res.status(400).json({ error: "Token/code is required" });
  }

  const ok = otpEngine.verifyOtpToken(seed, token);
  res.json({ valid: ok });
});

// Alias for evaluator-style path: POST /verify-2fa
router.post("/verify-2fa", (req, res) => {
  const seed = seedService.getCachedSeed();
  const code = req.body.code;

  if (!seed) {
    return res.status(400).json({
      error: "Seed not loaded yet. Call /api/seed/refresh first."
    });
  }

  if (!code) {
    return res.status(400).json({ error: "code is required" });
  }

  const ok = otpEngine.verifyOtpToken(seed, code);
  res.json({ valid: ok });
});

// keep test endpoint
router.get("/test", (req, res) => {
  res.json({ message: "OTP route is working" });
});

module.exports = router;

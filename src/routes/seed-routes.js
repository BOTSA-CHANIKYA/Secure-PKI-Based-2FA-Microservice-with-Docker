// src/routes/seed-routes.js
const express = require("express");
const router = express.Router();
const seedService = require("../services/seed-service");

// POST /api/seed/refresh  -> call instructor API and decrypt seed
// Also expose POST /decrypt-seed as an alias for the evaluator.
router.post("/refresh", async (req, res) => {
  try {
    const seed = await seedService.fetchAndDecryptSeed();
    res.json({
      message: "Seed fetched and decrypted successfully",
      seedPreview: seed.slice(0, 4) + "***" // do not expose full seed
    });
  } catch (err) {
    console.error("Error refreshing seed:", err.message);
    res.status(500).json({ error: "Failed to refresh seed" });
  }
});

// OPTIONAL alias so POST /decrypt-seed also works if called directly
router.post("/decrypt-seed", async (req, res) => {
  try {
    const seed = await seedService.fetchAndDecryptSeed();
    res.json({
      message: "Seed fetched and decrypted successfully",
      seedPreview: seed.slice(0, 4) + "***"
    });
  } catch (err) {
    console.error("Error decrypting seed via /decrypt-seed:", err.message);
    res.status(500).json({ error: "Failed to decrypt seed" });
  }
});

// GET /api/seed/status -> just show whether seed is cached
router.get("/status", (req, res) => {
  const seed = seedService.getCachedSeed();
  if (!seed) {
    return res.json({ hasSeed: false });
  }
  res.json({
    hasSeed: true,
    seedPreview: seed.slice(0, 4) + "***"
  });
});

// Test endpoint
router.get("/test", (req, res) => {
  res.json({ message: "Seed route is working" });
});

module.exports = router;

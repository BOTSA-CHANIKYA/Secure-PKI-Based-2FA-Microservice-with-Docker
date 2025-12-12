// src/routes/seed-routes.js
const express = require("express");
const router = express.Router();
const seedService = require("../services/seed-service");

// call instructor API and decrypt seed
router.post("/refresh", async (req, res) => {
  try {
    const seed = await seedService.fetchAndDecryptSeed();
    res.json({
      message: "Seed fetched and decrypted successfully",
      seedPreview: seed.slice(0, 4) + "***"  // do not expose full seed
    });
  } catch (err) {
    console.error("Error refreshing seed:", err.message);
    res.status(500).json({ error: "Failed to refresh seed" });
  }
});

// just show whether seed is cached
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

// keep your existing test endpoint
router.get("/test", (req, res) => {
  res.json({ message: "Seed route is working" });
});

module.exports = router;

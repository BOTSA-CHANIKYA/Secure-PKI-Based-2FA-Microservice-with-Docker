// src/services/seed-service.js
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const pkiManager = require("../crypto/pki-manager");

const INSTRUCTOR_API_URL = process.env.SEED_API_URL;
const STUDENT_ID = process.env.STUDENT_ID;
const REPO_URL = process.env.REPO_URL;

// in-memory cache of decrypted seed
let decryptedSeed = null;

// read PEM public key from Keys/public_instructor.pem
function loadPublicKeyPem() {
  const pemPath = path.join(__dirname, "..", "..", "Keys", "public_instructor.pem");
  return fs.readFileSync(pemPath, "utf8");
}

async function requestEncryptedSeed() {
  if (!INSTRUCTOR_API_URL || !STUDENT_ID || !REPO_URL) {
    throw new Error("Missing SEED_API_URL, STUDENT_ID, or REPO_URL in environment");
  }

  const payload = {
    student_id: STUDENT_ID,
    github_repo_url: REPO_URL,
    public_key: loadPublicKeyPem()
  };

  const response = await axios.post(INSTRUCTOR_API_URL, payload, {
    headers: { "Content-Type": "application/json" },
    timeout: 15000
  });

  // expected response: { encrypted_seed: "..." }
  if (!response.data || !response.data.encrypted_seed) {
    throw new Error("Instructor API did not return encrypted_seed");
  }

  return response.data.encrypted_seed;
}

async function fetchAndDecryptSeed() {
  const encryptedSeed = await requestEncryptedSeed();
  const seedPlain = pkiManager.decryptWithStudentKey(encryptedSeed);
  decryptedSeed = seedPlain;
  return seedPlain;
}

function getCachedSeed() {
  return decryptedSeed;
}

module.exports = {
  fetchAndDecryptSeed,
  getCachedSeed
};

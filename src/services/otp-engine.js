// src/services/otp-engine.js
const speakeasy = require("speakeasy");

// generate a token from an existing base32 seed
function generateOtpToken(base32Secret) {
  return speakeasy.totp({
    secret: base32Secret,
    encoding: "base32"
  });
}

function verifyOtpToken(base32Secret, token) {
  return speakeasy.totp.verify({
    secret: base32Secret,
    encoding: "base32",
    token,
    window: 1
  });
}

module.exports = {
  generateOtpToken,
  verifyOtpToken
};

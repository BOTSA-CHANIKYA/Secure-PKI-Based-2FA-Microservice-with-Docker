// src/crypto/pki-manager.js
const fs = require("fs");
const path = require("path");
const forge = require("node-forge");

const pki = forge.pki;

function loadInstructorPublicKey() {
  const pemPath = path.join(__dirname, "..", "..", "Keys", "public_instructor.pem");
  const pem = fs.readFileSync(pemPath, "utf8");
  return pki.publicKeyFromPem(pem);
}

function loadStudentPrivateKey() {
  const pemPath = path.join(__dirname, "..", "..", "Keys", "student_private.pem");
  const pem = fs.readFileSync(pemPath, "utf8");
  return pki.privateKeyFromPem(pem);
}

function encryptWithInstructorKey(plainText) {
  const publicKey = loadInstructorPublicKey();
  const bytes = forge.util.encodeUtf8(plainText);
  const encrypted = publicKey.encrypt(bytes, "RSA-OAEP", {
    md: forge.md.sha256.create()
  });
  return forge.util.encode64(encrypted);
}

function decryptWithStudentKey(base64Cipher) {
  const privateKey = loadStudentPrivateKey();
  const encryptedBytes = forge.util.decode64(base64Cipher);
  const decryptedBytes = privateKey.decrypt(encryptedBytes, "RSA-OAEP", {
    md: forge.md.sha256.create()
  });
  return forge.util.decodeUtf8(decryptedBytes);
}

module.exports = {
  encryptWithInstructorKey,
  decryptWithStudentKey
};

// tests/pki-selftest.js
const pkiManager = require("../src/crypto/pki-manager");

const cipher = pkiManager.encryptWithInstructorKey("hello-world");
console.log("cipher:", cipher);

const plain = pkiManager.decryptWithStudentKey(cipher);
console.log("plain:", plain);

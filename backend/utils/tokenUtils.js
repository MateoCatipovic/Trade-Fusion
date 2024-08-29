const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "3h"; // Adjust expiration as needed

function generateJwt(userId, csrfToken) {
  return jwt.sign(
    { userId, csrfToken }, // Include csrfToken in the payload
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

function generateCsrfToken() {
  return crypto.randomBytes(48).toString("hex");
}

module.exports = { generateJwt, generateCsrfToken };

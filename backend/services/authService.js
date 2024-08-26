const bcrypt = require("bcrypt");
const { generateJwt, generateCsrfToken } = require("../utils/tokenUtils");

async function verifyPassword(inputPassword, storedHashedPassword) {
  return await bcrypt.compare(inputPassword, storedHashedPassword);
}

function createTokens(userId) {
  const csrfToken = generateCsrfToken();
  const token = generateJwt(userId, csrfToken); // Pass csrfToken here
  return { token, csrfToken };
}

module.exports = {
  verifyPassword,
  createTokens,
};
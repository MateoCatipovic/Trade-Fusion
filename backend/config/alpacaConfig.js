require('dotenv').config();
const Alpaca = require("@alpacahq/alpaca-trade-api");

const apiKey = process.env.NEXT_PUBLIC_ALPACA_API_KEY;
const secretKey = process.env.NEXT_PUBLIC_ALPACA_SECRET_KEY;

const alpaca = new Alpaca({
  keyId: apiKey,
  secretKey: secretKey,
  feed: "iex", // Use IEX feed
});

module.exports = alpaca;
require('dotenv').config();
const WebSocket = require("ws");

const apiKey = process.env.NEXT_PUBLIC_ALPACA_API_KEY;
const secretKey = process.env.NEXT_PUBLIC_ALPACA_SECRET_KEY;
const externalStocksWsUrl = "wss://stream.data.alpaca.markets/v2/iex";
const externalCryptoWsUrl = "wss://stream.data.alpaca.markets/v1beta3/crypto/us";

let externalStockWs;
let externalCryptoWs;

function setupWebSocketServer(server) {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.send(JSON.stringify({ message: "Welcome to the real-time stock and crypto updates!" }));

    ws.on("message", (message) => {
      const clientMessage = JSON.parse(message);
      //console.log("Received from client:", clientMessage);
    });

    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });

  function connectToExternalStocksWs() {
    externalStockWs = new WebSocket(externalStocksWsUrl);

    externalStockWs.on("open", () => {
      console.log("Connected to external stock data provider");
      externalStockWs.send(JSON.stringify({ action: "auth", key: apiKey, secret: secretKey }));
    });

    externalStockWs.on("message", (data) => {
      let parsedData = JSON.parse(data);
      //console.log("Received data from external stock source:", parsedData);

      if (parsedData.some((message) => message.T === "success" && message.msg === "authenticated")) {
        externalStockWs.send(JSON.stringify({ action: "subscribe", trades: ["GOOGL"] }));
      }

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(parsedData));
        }
      });
    });

    externalStockWs.on("close", () => {
      console.log("External stock data provider connection closed, reconnecting...");
      setTimeout(connectToExternalStocksWs, 5000);
    });

    externalStockWs.on("error", (error) => {
      console.error("External stock WebSocket error:", error);
    });
  }

  function connectToExternalCryptoWs() {
    externalCryptoWs = new WebSocket(externalCryptoWsUrl);

    externalCryptoWs.on("open", () => {
      console.log("Connected to external crypto data provider");
      externalCryptoWs.send(JSON.stringify({ action: "auth", key: apiKey, secret: secretKey }));
    });

    externalCryptoWs.on("message", (data) => {
      let parsedData = JSON.parse(data);
      console.log("Received data from crypto external source:", parsedData);

      if (parsedData.some((message) => message.T === "success" && message.msg === "authenticated")) {
        externalCryptoWs.send(JSON.stringify({ action: "subscribe", quotes: ["AVAX/USD", "BTC/USD"] }));
      }

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(parsedData));
        }
      });
    });

    externalCryptoWs.on("close", () => {
      console.log("External crypto data provider connection closed, reconnecting...");
      setTimeout(connectToExternalCryptoWs, 5000);
    });

    externalCryptoWs.on("error", (error) => {
      console.error("External crypto WebSocket error:", error);
    });
  }

  connectToExternalCryptoWs();
  connectToExternalStocksWs();
}

module.exports = setupWebSocketServer;

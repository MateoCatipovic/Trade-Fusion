// Load environment variables from .env file
require("dotenv").config();
const Alpaca = require("@alpacahq/alpaca-trade-api");

const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const axios = require("axios");
const cors = require("cors");
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const apiKey = process.env.NEXT_PUBLIC_ALPACA_API_KEY;
const secretKey = process.env.NEXT_PUBLIC_ALPACA_SECRET_KEY;

// External WebSocket connection (e.g., to Alpaca API or another market data provider)
const externalStocksWsUrl = "wss://stream.data.alpaca.markets/v2/iex";
const externalCryptoWsUrl =
  "wss://stream.data.alpaca.markets/v1beta3/crypto/us";
let externalStockWs;
let externalCryptoWs;
const alpaca = new Alpaca({
  keyId: apiKey,
  secretKey: secretKey,
  feed: "iex", // Use IEX feed
});

app.use(cors());

app.get("/api/historical/:type/:symbol", async (req, res) => {
  const { type, symbol } = req.params;
  console.log("Requested type:", type);
  console.log("Requested symbol:", symbol);
  try {
    const data = await fetchHistoricalData(type, symbol);
    console.log("podaci: ", data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching data" });
  }
});

// Handle WebSocket connections from clients
wss.on("connection", (ws) => {
  console.log("Client connected");

  // Send a message to the client
  ws.send(
    JSON.stringify({
      message: "Welcome to the real-time stock and crypto updates!",
    })
  );

  // Handle messages from clients (e.g., client requesting specific stock data)
  ws.on("message", (message) => {
    const clientMessage = JSON.parse(message);
    console.log("Received from client:", clientMessage);
    // Process client requests here, if needed
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

// Connect to the external WebSocket data source
function connectToExternalStocksWs() {
  externalStockWs = new WebSocket(externalStocksWsUrl);

  externalStockWs.on("open", () => {
    console.log("Connected to external data provider");
    externalStockWs.send(
      JSON.stringify({ action: "auth", key: apiKey, secret: secretKey })
    );
  });

  externalStockWs.on("message", (data) => {
    let parsedData = JSON.parse(data);
    console.log("Received data from external source:", parsedData);

    // Example of subscribing to a symbol after authentication
    if (
      parsedData.some(
        (message) => message.T === "success" && message.msg === "authenticated"
      )
    ) {
      externalStockWs.send(
        JSON.stringify({
          action: "subscribe",
          trades: ["GOOGL"], // Subscribe to test symbol"
          //quotes: ["GOOGL"]
          // dailyBars:["GOOGL"],
        })
      );
    }

    // Broadcast data to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(parsedData));
      }
    });
  });

  externalStockWs.on("close", () => {
    console.log("External data provider connection closed, reconnecting...");
    setTimeout(connectToExternalStocksWs, 5000); // Reconnect after a delay
  });

  externalStockWs.on("error", (error) => {
    console.error("External WebSocket error:", error);
  });
}

function connectToExternalCryptoWs() {
  externalCryptoWs = new WebSocket(externalCryptoWsUrl);

  externalCryptoWs.on("open", () => {
    console.log("Connected to external data provider");
    externalCryptoWs.send(
      JSON.stringify({ action: "auth", key: apiKey, secret: secretKey })
    );
  });

  externalCryptoWs.on("message", (data) => {
    let parsedData = JSON.parse(data);
    console.log("Received data from external source:", parsedData);

    // Example of subscribing to a symbol after authentication
    if (
      parsedData.some(
        (message) => message.T === "success" && message.msg === "authenticated"
      )
    ) {
      externalCryptoWs.send(
        JSON.stringify({
          action: "subscribe",
          trades: ["AVAX/USD", "BTC/USD"],
          //quotes: ["AVAX/USD", "BTC/USD"]
        })
      );
    }

    // Broadcast data to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(parsedData));
      }
    });
  });

  externalCryptoWs.on("close", () => {
    console.log("External data provider connection closed, reconnecting...");
    setTimeout(connectToExternalCryptoWs, 5000); // Reconnect after a delay
  });

  externalCryptoWs.on("error", (error) => {
    console.error("External WebSocket error:", error);
  });
}

// // Function to fetch historical data
// async function fetchHistoricalData(symbol) {
//   try {
//     const alpaca = new Alpaca({
//       keyId: apiKey,
//       secretKey: secretKey,
//     });

//     // Get the current date and format it as a string
//     const endDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

//     let options = {
//       start: "2024-01-01",
//       end: endDate,
//       timeframe: alpaca.newTimeframe(1, alpaca.timeframeUnit.DAY),
//     };

//     (async () => {
//       const bars = await alpaca.getCryptoBars([symbol], options);

//       console.log(bars.get(symbol));
//     })();
//   } catch (error) {
//     console.error("Error fetching data:", error);
//   }
// }

// Function to fetch historical data
async function fetchHistoricalData(type, symbol) {
  try {
    const endDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
    const optionsStocks = {
      start: "2024-01-01",
      end: endDate,
      timeframe: "1Day",
      feed: "iex", // Use IEX feed
    };
    const optionsCrypto = {
      start: "2024-01-01",
      end: endDate,
      timeframe: "1Day",
    };

    let bars;
    if (type === "crypto") {
      bars = await alpaca.getCryptoBars([symbol], optionsCrypto);
      return bars.get(symbol);
    } else if (type === "stock") {
      bars = await alpaca.getBarsV2([symbol], optionsStocks);
      const barsArray = [];

      // Consume the async iterable
      for await (const bar of bars) {
        barsArray.push(bar);
      }

      return barsArray;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

// Call the function with the desired stock symbol
//fetchHistoricalData("crypto", "BTC/USD");
connectToExternalCryptoWs();
connectToExternalStocksWs();

// Start the Express server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

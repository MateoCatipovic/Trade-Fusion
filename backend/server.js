// Load environment variables from .env file
require("dotenv").config();
const Alpaca = require("@alpacahq/alpaca-trade-api");

const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const axios = require("axios");
const cors = require("cors");
const cheerio = require("cheerio");
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

app.get("/api/news/:category", async (req, res) => {
  const { category } = req.params;
  console.log("Category", category);
  try {
    const data = await fetchNews(category);
    // Display the articles
    data.articles.forEach((article, index) => {
      console.log(`Article ${index + 1}:`);
      console.log(`Title: ${article.title}`);
      console.log(`URL: ${article.url}`);
      console.log(`Date: ${article.seendate}`);
      console.log(`Image URL: ${article.socialimage}`);
      console.log("--------------------------------");
    });
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

// Function to fetch Forex-related news from GDELT API
async function fetchNews(category) {
  const query = category; // Query for Forex-related news
  const maxRecords = 30; // Number of records to return
  const outputFormat = "json"; // Output format

  // Construct the API URL
  const url = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(
    query + " sourcelang:english"
  )}&mode=artlist&maxrecords=${maxRecords}&format=${outputFormat}`;

  try {
    // Make the API request
    const response = await fetch(url);

    // Check if the request was successful
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the JSON response
    const data = await response.json();
    // console.log("kateg", category);
    // if (category === "Forex") {
    //   return processArticles(data, forexImg);
    // } else {
    //   return data;
    // }

    //  // Display the articles
    // data.articles.forEach((article, index) => {
    //   console.log(`Article ${index + 1}:`);
    //   console.log(`Title: ${article.title}`);
    //   console.log(`URL: ${article.url}`);
    //   console.log(`Date: ${article.seendate}`);
    //   console.log("--------------------------------");
    // });
    return data;
  } catch (error) {
    console.error("Failed to fetch Forex news:", error);
  }
}

// Main function to process articles
async function processArticles(data, imageUrl) {
  try {
    console.log("News: ", data.articles);

    // Create a new array to hold the articles with image URLs
    const articlesWithImages = await Promise.all(
      data.articles.map(async (article, index) => {
        // Fetch the image URL for each article
        // const imageUrl = await getImageUrl(article.url);

        // Add the image URL to the article object
        return {
          ...article,
          imageUrl: imageUrl,
        };
      })
    );

    // // Display the articles with image URLs
    // articlesWithImages.forEach((article, index) => {
    //   console.log(`Article ${index + 1}:`);
    //   console.log(`Title: ${article.title}`);
    //   console.log(`URL: ${article.url}`);
    //   console.log(`Date: ${article.seendate}`);
    //   console.log(`Image URL: ${article.imageUrl}`);
    //   console.log("--------------------------------");
    // });

    return articlesWithImages;
  } catch (error) {
    console.error("Failed to fetch news:", error);
  }
}

async function getImageUrl(articleUrl) {
  try {
    const { data } = await axios.get(articleUrl, {
      headers: {
        "User-Agent": " Chrome/91.0.4472.124 ",
      },
    });

    const $ = cheerio.load(data);
    const imageUrl = $("img").first().attr("src"); // Adjust selector as needed

    return imageUrl;
  } catch (error) {
    console.error("Error fetching the article:", error);
    return null;
  }
}

// Call the function to fetch Forex news
//fetchNews();

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
//connectToExternalCryptoWs();
//connectToExternalStocksWs();

// Start the Express server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

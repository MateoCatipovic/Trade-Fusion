const alpaca = require("../config/alpacaConfig");

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

module.exports = { fetchHistoricalData };

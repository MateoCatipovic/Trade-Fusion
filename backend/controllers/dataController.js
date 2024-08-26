const { fetchHistoricalData } = require("../services/alpacaService");
const { fetchNews } = require("../services/newsService");
const axios = require("axios");

async function getHistoricalData(req, res) {
  const { type, symbol } = req.params;
  try {
    const data = await fetchHistoricalData(type, symbol);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching data" });
  }
}

async function getNews(req, res) {
  const { category } = req.params;
  try {
    const data = await fetchNews(category);
    console.log("controller data: ", data);
    res.json(data);
  } catch (error) {
    console.error('Error fetching news:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Error fetching data' });
    }
  }
}

module.exports = { getHistoricalData, getNews };

const express = require("express");
const { getHistoricalData, getNews } = require("../controllers/dataController");

const router = express.Router();

router.get("/historical/:type/:symbol", getHistoricalData);
router.get("/news/:category", getNews);

module.exports = router;
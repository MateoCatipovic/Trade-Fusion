const axios = require("axios");
async function fetchNews(category) {
  const query = category; // Query for news
  const maxRecords = 30; // Number of records to return
  const outputFormat = "json"; // Output format

  const url = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(
    query + " sourcelang:english"
  )}&mode=artlist&maxrecords=${maxRecords}&format=${outputFormat}`;

  try {
    const response = await axios.get(url);

    if (response.status !== 200) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.data; // Return the data from the API response
  } catch (error) {
    console.error("Failed to fetch news:", error);
    throw error; // Propagate error to the caller
  }
}
module.exports = { fetchNews };

import axios from "axios";

export const fetchHistoricalData = async (type, symbol) => {
  const encodedSymbol = encodeURIComponent(symbol); // Encode the symbol
  const url = `http://localhost:5000/api/historical/${type}/${encodedSymbol}`;
  console.log("Request URL:", url);
  try {
    const response = await axios.get(url);
    console.log("API fetch response:", response.data);
    return response.data; // Return the fetched data
  } catch (error) {
    console.error("Error fetching data:", error);
    return []; // Return an empty array or null on error
  }
};

import axios from 'axios';

export const fetchHistoricalData = async (type, symbol) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/historical/${type}/${symbol}`);
    console.log("API fetch response:", response.data);
    return response.data; // Return the fetched data
  } catch (error) {
    console.error("Error fetching data:", error);
    return []; // Return an empty array or null on error
  }
};

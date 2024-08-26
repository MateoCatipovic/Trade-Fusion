import axios from "axios";

export const fetchNews = async (category) => {
  //const encodedCategory = encodeURIComponent(category); // Encode the symbol
  const url = `http://localhost:5000/api/news/${category}`;
  console.log("Request URL:", url);
  try {
    // Get the CSRF token from localStorage
    const csrfToken = localStorage.getItem("csrfToken");


    // Make the API request with the CSRF token in the headers
    const response = await axios.get(url, {
      headers: {
        'X-CSRF-Token': csrfToken,
      },
      withCredentials: true,  // Important for cookies
    });
    console.log("API fetch response:", response.data);
    
    // Display the articles
    const data = response.data;
    // // Log the entire data to verify its structure
    console.log("API response data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return []; // Return an empty array or null on error
  }
};

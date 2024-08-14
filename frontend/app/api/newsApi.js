import axios from "axios";

export const fetchNews = async (category) => {
   //const encodedCategory = encodeURIComponent(category); // Encode the symbol
  const url = `http://localhost:5000/api/news/${category}`;
  console.log("Request URL:", url);
  try {
    const response = await axios.get(url);
     console.log("API fetch response:", response.data);
    // Display the articles
    const data = response.data;
    // // Log the entire data to verify its structure
     console.log("API response data:", data);

    // // Ensure data.articles is defined and is an array
    // if (data && Array.isArray(data.articles)) {
    //   data.articles.forEach((article, index) => {
    //     console.log(`Article ${index + 1}:`);
    //     console.log(`Title: ${article.title}`);
    //     console.log(`URL: ${article.url}`);
    //     console.log(`Date: ${article.seendate}`);
    //     console.log(`Image URL: ${article.imageUrl}`);
    //     console.log("--------------------------------");
    //   });
      return data;
    }
   catch (error) {
    console.error("Error fetching data:", error);
    return []; // Return an empty array or null on error
  }
};

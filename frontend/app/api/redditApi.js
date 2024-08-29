import axios from "axios"; // Make sure to import axios

export const fetchRedditPosts = async (sort_by, time_filter) => {
  try {
    const csrfToken = localStorage.getItem("csrfToken");
    const response = await axios.get(
      "http://localhost:5000/social/fetch-reddit-posts",
      {
        params: {
          // Pass query parameters here
          sort_by: sort_by,
          time_filter: time_filter,
        },
        headers: {
          "X-CSRF-Token": csrfToken,
        },
        withCredentials: true, // Important for cookies
      }
    );
    const data = await response.data;
    console.log("Subreddits:", data.subreddits);
    console.log("Reddit Posts:", data.redditPosts);
    // Axios stores the response data in a 'data' field

    return data;
  } catch (error) {
    console.error("Error fetching Reddit posts:", error.message);
    return null; // Return null or handle the error appropriately in your UI
  }
};

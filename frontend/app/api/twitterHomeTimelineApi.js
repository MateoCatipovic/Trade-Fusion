import axios from "axios";

export const fetchTweetsApi = async () => {
  try {
    const csrfToken = localStorage.getItem("csrfToken");
    const response = await axios.get(
      "http://localhost:5000/social/fetch-twitter-posts",
      {
        headers: {
          "X-CSRF-Token": csrfToken,
        },
        withCredentials: true, // Important for cookies
      }
    );
    if (response.data) {
      return response.data;
    }
  } catch (error) {}
};

export const twitterLogoutApi = async () => {
  try {
    const csrfToken = localStorage.getItem("csrfToken");
    const response = await axios.post(
      "http://localhost:5000/auth/twitter-logout",
      {},
      {
        headers: {
          "X-CSRF-Token": csrfToken,
        },
        withCredentials: true, // Important for cookies
      }
    );
    if (response.data.success) {
      return response.data;
    }
  } catch (error) {}
};

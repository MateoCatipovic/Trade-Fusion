import axios from "axios";

export const twitterLoginApi = async (username, email, password) => {
  try {
    const csrfToken = localStorage.getItem("csrfToken");
    const response = await axios.post(
      "http://localhost:5000/auth/twitter-login",
      {
        username: username,
        email: email,
        password: password,
      },
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
  } catch (error) {
    return error;
  }
};

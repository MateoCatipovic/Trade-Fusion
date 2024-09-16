import axios from "axios";

export const logIn = async (emailOrUsername, password) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/auth/login",
      {
        emailOrUsername,
        password,
      },
      {
        withCredentials: true,
      }
    );
    // Handle successful login
    if (response.status === 200) {
      // Correct header key to access the CSRF token
      const csrfToken = response.headers["x-csrf-token"];
      const username = response.data.userName;

      localStorage.setItem("csrfToken", csrfToken);
      localStorage.setItem("username", username);
      localStorage.setItem("isLoggedIn", "true");
      // If using cookies, the token is already set by the backend
      return {
        message: response.data.message,
      };
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return error;
  }
};

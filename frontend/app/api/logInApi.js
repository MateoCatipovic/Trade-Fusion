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
        withCredentials: true, // Ensure credentials are sent with requests
      }
    );
    // Successful login
    if (response.status === 200) {
      // Handle successful login
      console.log("Login successful:", response.data.message);
      console.log("Logged in as:", response.data.userName);
      console.log("response header", response.headers)
      // Correct header key to access the CSRF token
      const csrfToken = response.headers["x-csrf-token"];
      const username = response.data.userName;
      console.log("CSRF TOKEN:", csrfToken);

      localStorage.setItem("csrfToken", csrfToken);
      localStorage.setItem("username", username);

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

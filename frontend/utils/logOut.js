import axios from "axios";

export const logOut = async () => {
    console.log("entered in logout")
    try {
      // Send a request to the backend to log out
      const response = await axios.post(
        "http://localhost:5000/auth/logout",
        {},
        { withCredentials: true }
      );
      console.log(response.status)
      if (response.status === 200) {
        localStorage.removeItem("username");
        localStorage.removeItem("csrfToken");
        window.location.href = "/SignIn";
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
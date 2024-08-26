// For subsequent requests:
const csrfToken = localStorage.getItem("csrfToken");
fetch("/api/some-endpoint", {
  method: "GET",
  headers: {
    "X-CSRF-Token": csrfToken, // Include the CSRF token from Local Storage
  },
})
  .then((response) => {
    // Handle the response
  })
  .catch((error) => console.error("Request failed:", error));
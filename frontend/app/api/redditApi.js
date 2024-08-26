export const fetchRedditPosts = async () => {
  try {
    const response = await fetch(
      "http://localhost:5000/social/fetch-reddit-posts"
    );
    console.log(response)
    if (response.ok) { // Check if the response status is OK (200–299)
        return response.json();
      } else {
        console.error('Server returned an error response', response.status);
      }
  } catch (error) {
    console.error("Error fetching tweets:", error);
  }
};

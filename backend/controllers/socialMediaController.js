const { default: axios } = require("axios");


  const fetchRedditPosts = async (req, res) => {
    try {
      const response = await axios.get(
        "http://localhost:4000/fetch-reddit-posts"
      );
      console.log(response.data)
      if (response.data) {
        return (response.data); // Respond with the data from the other server
      }
    } catch (error) {
      console.error("Error fetching Reddit posts:", error);
      return res.status(500).json({ error: "Failed to fetch Reddit posts." });
    }
  };


module.exports = { fetchRedditPosts };

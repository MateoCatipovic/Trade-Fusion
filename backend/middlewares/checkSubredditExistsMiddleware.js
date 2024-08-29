const axios = require("axios");

// Middleware function to check if a subreddit exists
const checkSubredditExistsMiddleware = async (req, res, next) => {
  const { subreddits } = req.body; // Assume subreddit name is passed in the request body
  console.log("subreddit in mid: ",subreddits);
  if (!subreddits) {
    return res.status(400).json({ error: "Subreddit name is required." });
  }

  try {
    // Call Reddit API to check subreddit existence
    const response = await axios.get(
      `https://www.reddit.com/r/${subreddits}/about.json`,
      {
        validateStatus: function (status) {
          return status < 500; // Resolve only if the status code is less than 500
        },
      }
    );

    if (response.status === 404) {
      // Subreddit does not exist
      return res.status(404).json({ error: "Subreddit does not exist." });
    }

    // Subreddit exists, proceed to next middleware or route handler
    next();
  } catch (error) {
    console.error("Error checking subreddit existence:", error);
    return res
      .status(500)
      .json({ error: "Internal server error while checking subreddit." });
  }
};

module.exports = { checkSubredditExistsMiddleware };

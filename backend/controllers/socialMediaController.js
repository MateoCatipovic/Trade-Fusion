const { default: axios } = require("axios");
const { fetchSubredditsFromDB } = require("../services/fetchAndSendSubreddits");
const { getTwitterSessionService } = require("../services/twitterService");

const fetchRedditPosts = async (req, res) => {
  const userId = req.user.userId;
  if (!userId) {
    return res.status(401).json({ error: "User ID is missing" });
  }

  const sort_by = req.query.sort_by;
  if (!sort_by) {
    return res.status(401).json({ error: "Sort_by filter is missing" });
  }

  const time_filter = req.query.time_filter;
  if (!time_filter) {
    return res.status(401).json({ error: "time_filter is missing" });
  }

  const subreddits = await fetchSubredditsFromDB(userId);
  if (subreddits.length === 0) {
    console.log("No subreddits to send.");
    return res.status(200).json({ subreddits: [], redditPosts: [] });
  }

  try {
    const response = await axios.post(
      "http://localhost:4000/fetch-reddit-posts",
      {
        subreddits: subreddits, // Sending subreddit names in request body
        sort_by: sort_by,
        time_filter: time_filter,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Response from Python server:", response.data);
    if (response.data) {
      return res.status(200).json({
        subreddits: subreddits,
        redditPosts: response.data,
      });
    }
  } catch (error) {
    console.error("Error fetching Reddit posts:", error);
    return res.status(500).json({ error: "Failed to fetch Reddit posts." });
  }
};

const fetchTwiterPosts = async (req, res) => {
  const userId = req.user.userId;
  if (!userId) {
    return res.status(401).json({ error: "User ID is missing" });
  }

  try {
    const cookie = await getTwitterSessionService(userId);
    const response = await axios.post(
      "http://localhost:4000/fetch-tweets",
      {
        cookie: cookie,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response.data);
    if (response.data) {
      return res.status(200).json(response.data);
    }
  } catch (error) {
    console.error("Error fetching Reddit posts:", error);
    return res.status(500).json({ error: "Failed to fetch Reddit posts." });
  }
};

module.exports = { fetchRedditPosts, fetchTwiterPosts };

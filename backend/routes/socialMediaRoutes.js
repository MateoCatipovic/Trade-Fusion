const express = require("express");
const { fetchRedditPosts } = require("../controllers/socialMediaController");
const { fetchTwiterPosts } = require("../controllers/socialMediaController");
const { saveSubredditToUser } = require("../controllers/subredditController");
const { deleteSubreddit } = require("../controllers/subredditController");
const {
  checkSubredditExistsMiddleware,
} = require("../middlewares/checkSubredditExistsMiddleware");

const router = express.Router();

router.get("/fetch-reddit-posts", fetchRedditPosts);
router.get("/fetch-twitter-posts", fetchTwiterPosts);
router.post(
  "/save-subreddit",
  checkSubredditExistsMiddleware,
  saveSubredditToUser
);
router.delete("/delete-subreddit", deleteSubreddit);


module.exports = router;

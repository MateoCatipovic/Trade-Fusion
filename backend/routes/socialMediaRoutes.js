const express = require("express");
const { fetchRedditPosts } = require("../controllers/socialMediaController");

const router = express.Router();

router.get("/fetch-reddit-posts", fetchRedditPosts);

module.exports = router;
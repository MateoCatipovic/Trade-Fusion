// controllers/subredditController.js
const { createClient } = require("@supabase/supabase-js");
const {
  deleteSubredditsService,
} = require("../services/userSubredditsService");
const {
  fetchSubredditIDService,
} = require("../services/userSubredditsService");
// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const saveSubredditToUser = async (req, res) => {
  const { subreddits } = req.body; // The subreddit name comes from the request body
  const userId = req.user ? req.user.userId : null; // Check if userId is available
  console.log("User ID: ", userId);

  if (!userId) {
    return res.status(400).json({ error: "User ID is missing or invalid." });
  }

  if (!subreddits) {
    return res.status(400).json({ error: "Subreddit name is required." });
  }

  try {
    // Start a transaction
    await supabase.rpc("begin_transaction");

    // Check if the subreddit already exists
    const { data: subredditData, error: subError } = await supabase
      .from("subreddits")
      .select("id")
      .eq("name", subreddits)
      .single();

    if (subError && subError.code !== "PGRST116") {
      // If there's an error other than "No rows", return error
      console.log(subError.message);
      throw new Error(subError.message);
    }

    let subredditId;

    if (subredditData) {
      // Subreddit exists, get its ID
      subredditId = subredditData.id;
    } else {
      // Subreddit does not exist, insert it
      const { data: newSubreddit, error: insertError } = await supabase
        .from("subreddits")
        .insert([{ name: subreddits }])
        .select()
        .single();

      if (insertError) {
        console.log(insertError.message);
        throw new Error(insertError.message);
      }

      subredditId = newSubreddit.id;
    }

    // Check if the user is already subscribed to the subreddit
    const { data: userSubredditData, error: userSubError } = await supabase
      .from("user_subreddits")
      .select("*")
      .eq("user_id", userId)
      .eq("subreddit_id", subredditId)
      .single();

    if (userSubError && userSubError.code !== "PGRST116") {
      throw new Error(userSubError.message);
    }

    if (userSubredditData) {
      // User already follows this subreddit
      await supabase.rpc("commit_transaction"); // Commit transaction
      return res
        .status(200)
        .json({ message: "Subreddit already followed by the user." });
    }

    // Insert into the 'user_subreddits' table
    const { error: insertUserSubError } = await supabase
      .from("user_subreddits")
      .insert([{ user_id: userId, subreddit_id: subredditId }]);

    if (insertUserSubError) {
      throw new Error(insertUserSubError.message);
    }

    // Commit the transaction
    await supabase.rpc("commit_transaction");

    res.status(200).json({ message: "Subreddit successfully saved to user." });
  } catch (error) {
    // Rollback the transaction in case of error
    await supabase.rpc("rollback_transaction");
    console.error("Error saving subreddit to user:", error);
    res
      .status(500)
      .json({ error: "Internal server error while saving subreddit." });
  }
};

const deleteSubreddit = async (req, res) => {
  const { subreddit } = req.body;
  const userId = req.user.userId; // Assuming you get userId from auth middleware

  try {
    const subreddit_id = await fetchSubredditIDService(subreddit);
    // Perform database operation to delete the subreddit
    const response = await deleteSubredditsService(userId, subreddit_id);
    if (response) {
      res.status(200).json({ message: "Subreddit deleted successfully." });
    }
  } catch (error) {
    console.error("Error deleting subreddit:", error);
    res.status(500).json({ error: "Failed to delete subreddit." });
  }
};

module.exports = { saveSubredditToUser, deleteSubreddit };

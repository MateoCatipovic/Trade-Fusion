const supabase = require("../config/supabaseConfig");

async function userSubredditsService(userId) {
  // Check if user exists by email or username
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .or(`email.eq.${emailOrUsername},username.eq.${emailOrUsername}`)
    .single();

  if (error || !user) {
    return res.status(400).json({ error: "Invalid credentials" });
  }
  return user;
}

async function fetchSubredditIDService(subreddit) {
  try {
    console.log(subreddit)
    // Query the subreddits table to get the ID of the subreddit with the given name
    const { data: subredditData, error } = await supabase
      .from("subreddits")
      .select("id")
      .eq("name", subreddit)
      .single(); // single() expects a single result since names are unique

    // Handle any errors from the Supabase query
    if (error) {
      console.error("Error fetching subreddit ID:", error.message);
      return null; // Return null or handle the error as needed
    }

    // Check if the subredditData is not null or undefined before accessing its properties
    if (!subredditData) {
      console.log("Subreddit not found.");
      return null; // Subreddit does not exist in the database
    }

    console.log("Fetched subreddit ID:", subredditData.id);
    return subredditData.id; // Return the subreddit ID if found
  } catch (err) {
    console.error("Unexpected error in fetchSubredditIDService:", err);
    return null; // Handle unexpected errors
  }
}

async function deleteSubredditsService(userId, subreddit) {
  const { error: deleteError } = await supabase
    .from("user_subreddits")
    .delete()
    .match({ user_id: userId, subreddit_id: subreddit }); // Adjust the query as needed

  if (deleteError) {
    console.error("Error deleting subreddit for user:", deleteError);
    return { success: false, message: "Failed to delete subreddit for user" };
  }

  console.log("Subreddit successfully deleted for user.");
  return { success: true, message: "Subreddit successfully deleted for user" };
}

module.exports = {
  userSubredditsService,
  deleteSubredditsService,
  fetchSubredditIDService,
};

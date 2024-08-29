const supabase = require("../config/supabaseConfig");

// Function to get all subreddits followed by users from the database
async function fetchSubredditsFromDB(userId) {
  console.log("userid in service", userId);
  try {
    const { data, error } = await supabase
      .from("user_subreddits")
      .select(
        `
      subreddit_id (name)
    `
      )
      .eq("user_id", userId);

    if (error) {
      throw new Error(
        `Error fetching subreddits from database: ${error.message}`
      );
    }
    console.log(data);
    // Extract subreddit names
    const subredditNames = data.map(
      (entry) => entry.subreddit_id.name
    );
    return subredditNames;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to fetch subreddits from the database");
  }
}

module.exports = {
  fetchSubredditsFromDB,
};

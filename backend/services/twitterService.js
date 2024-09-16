const supabase = require("../config/supabaseConfig");

async function twitterLoginService(user_id, cookie) {
  try {
    // Check if the user_id already exists in the user_sessions table
    const { data: existingUser, error: selectError } = await supabase
      .from("user_twitter_sessions")
      .select("id")
      .eq("user_id", user_id)
      .single(); // `single()` ensures we only get one record or null

    if (selectError && selectError.code !== "PGRST116") {
      console.log("selecterror", selectError);
      throw selectError;
    }

    if (existingUser) {
      // If user_id exists, update the cookie_data
      const { error: updateError } = await supabase
        .from("user_twitter_sessions")
        .update({ cookie_data: cookie })
        .eq("user_id", user_id);

      if (updateError) {
        console.log("updateError", updateError);
        throw updateError;
      }

      return { success: true, message: "Cookie data updated successfully." };
    } else {
      // If user_id does not exist, insert a new record
      const { error: insertError } = await supabase
        .from("user_twitter_sessions")
        .insert({
          user_id: user_id,
          cookie_data: cookie,
        });

      if (insertError) {
        console.log("insert error");
        throw insertError;
      }

      return { success: true, message: "New session created successfully." };
    }
  } catch (error) {
    console.error("Error in twitterLoginService:", error.message);
    return { success: false, message: error.message };
  }
}

async function getTwitterSessionService(user_id) {
  try {
    // Check if the user_id already exists in the user_sessions table
    const { data: cookie, error: selectError } = await supabase
      .from("user_twitter_sessions")
      .select("cookie_data")
      .eq("user_id", user_id)
      .single(); // `single()` ensures we only get one record or null

    if (selectError) {
      console.log("cookieError", selectError);
      throw selectError;
    }
    console.log("ccokie iz baze:", cookie.cookie_data);
    if (cookie.cookie_data) {
      return cookie.cookie_data;
    }
  } catch (error) {
    console.error("Error in twitterLoginService:", error.message);
    return { success: false, message: error.message };
  }
}
module.exports = { twitterLoginService, getTwitterSessionService };

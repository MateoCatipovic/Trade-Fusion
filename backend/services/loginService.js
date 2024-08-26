const supabase = require("../config/supabaseConfig");


async function findUserByEmailOrUsername(emailOrUsername) {
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

module.exports = {
  findUserByEmailOrUsername,
};


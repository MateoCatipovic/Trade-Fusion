// services/userService.js
const bcrypt = require("bcrypt");
const { supabase } = require("../config/supabaseConfig"); // Adjust the path to your Supabase configuration

// Function to check if an email exists
async function isEmailTaken(email) {
  const { data: existingUserByEmail, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error && error.code !== 'PGRST116') {
    // Supabase error not related to missing data
    throw error;
  }

  return !!existingUserByEmail;
}

// Function to check if a username exists
async function isUsernameTaken(userName) {
  const { data: existingUserByUsername, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", userName)
    .single();

  if (error && error.code !== 'PGRST116') {
    // Supabase error not related to missing data
    throw error;
  }

  return !!existingUserByUsername;
}

// Function to create a new user
async function createUser(email, userName, password) {
  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert new user into the database
  const { error } = await supabase.from("users").insert([
    {
      email: email,
      username: userName,
      password: hashedPassword,
    },
  ]);

  if (error) {
    throw error;
  }
}

// Exporting functions for use in the controller
module.exports = {
  isEmailTaken,
  isUsernameTaken,
  createUser,
};

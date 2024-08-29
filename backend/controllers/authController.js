const {
  isEmailTaken,
  isUsernameTaken,
  createUser,
} = require("../services/registerService");
const { findUserByEmailOrUsername } = require("../services/loginService");
const { verifyPassword, createTokens } = require("../services/authService");

async function login(req, res) {
  const { emailOrUsername, password } = req.body;

  try {
    // Check if user exists by email or username
    const user = await findUserByEmailOrUsername(emailOrUsername);

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Check password
    const validPassword = await verifyPassword(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate JWT and CSRF token
    const { token, csrfToken } = createTokens(user.id);

    // console.log("token:", token);
    // console.log("csrf:", csrfToken);

    // Send JWT in an HttpOnly cookie and CSRF token in header
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });
    res.set("X-CSRF-Token", csrfToken);

    return res
      .status(200)
      .json({ message: "Login successful", userName: user.username, userId: user.id });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function register(req, res) {
  const { email, userName, password } = req.body;

  try {
    // Check if email already exists
    if (await isEmailTaken(email)) {
      return res.status(400).json({ error: "Email is already in use" });
    }

    // Check if username already exists
    if (await isUsernameTaken(userName)) {
      return res.status(400).json({ error: "Username is already taken" });
    }

    // Create new user
    await createUser(email, userName, password);

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Server error" });
  }
}

async function logout(req, res) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });
    console.log("Logout successful");
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { login, register, logout };

const { default: axios } = require("axios");
const {
  isEmailTaken,
  isUsernameTaken,
  createUser,
} = require("../services/registerService");
const { findUserByEmailOrUsername } = require("../services/loginService");
const { verifyPassword, createTokens } = require("../services/authService");
const { twitterLoginService } = require("../services/twitterService");

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
      maxAge: 60000,
    });
    res.set("X-CSRF-Token", csrfToken);

    return res.status(200).json({
      message: "Login successful",
      userName: user.username,
      userId: user.id,
    });
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

async function checkCookie(req, res) {
  try {
    const token = req.cookies["token"]; // Fetch the token cookie
    if (token) {
      res.json({ success: true });  // Send the token in the response
    } else {
      res.json({ success: false });  // Send a different message if the token is not present
    }
  } catch (error) {
    console.error("Session error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function loginTwitter(req, res) {
  const user_id = req.user.userId;
  if (!user_id) {
    return res.status(401).json({ error: "User ID is missing" });
  }

  const { username, email, password } = req.body;
  if (!username) {
    return res.status(400).json({ error: "Username missing in body" });
  }
  if (!email) {
    return res.status(400).json({ error: "Email missing in body" });
  }
  if (!password) {
    return res.status(400).json({ error: "Password missing in body" });
  }

  try {
    const response = await axios.post(
      "http://localhost:4000/login-twitter",
      {
        username: username, // Sending subreddit names in request body
        email: email,
        password: password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Response from Python server:", response.data.cookie);
    console.log("Response from Python server:", response.data.success);
    const cookie = response.data.cookie;
    if (cookie) {
      const response = await twitterLoginService(user_id, cookie);
      console.log(response);
      if (response.success) {
        return res
          .status(200)
          .json({ success: true, message: "Login successful" });
      }
    }

    // return res.status(200).json({
    //   message: "Login successful",
    // });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function logoutTwitter(req, res) {
  try {
    const response = await axios.post("http://localhost:4000/logout-twitter", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Response from Python server:", response.data.success);
    if (response.data.success) {
      return res
        .status(200)
        .json({ success: true, message: "Logout successful" });
    }

    // if (response.data) {
    // const response = await twitterLoginService(user_id, cookie);

    // }

    // return res.status(200).json({
    //   message: "Login successful",
    // });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  login,
  register,
  logout,
  loginTwitter,
  logoutTwitter,
  checkCookie,
};

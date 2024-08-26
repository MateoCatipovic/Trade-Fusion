const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
  const csrfToken = req.get("X-CSRF-Token");
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Token is missing" });
  }

  console.log("csrf: ", csrfToken);

 try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.csrfToken !== csrfToken) {
      return res.status(403).json({ error: "Forbidden - CSRF token invalid" });
    }
    req.user = decoded; // Attach user data to req object
    next(); // Proceed to the next middleware/route handler
  } catch (err) {
    console.error("Token verification failed:", err);
    return res.status(403).json({ error: "Forbidden - Token verification failed" });
  }
}

module.exports = authenticateToken;

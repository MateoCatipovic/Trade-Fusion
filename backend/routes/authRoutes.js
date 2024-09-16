const express = require("express");
const {
  login,
  register,
  logout,
  checkCookie,
  loginTwitter,
  logoutTwitter,
} = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/login", login); 
router.post("/register", register);
router.post("/logout", logout);
router.get("/check-cookie", checkCookie);
router.post("/twitter-login", authMiddleware, loginTwitter);
router.post("/twitter-logout", authMiddleware, logoutTwitter);

module.exports = router;
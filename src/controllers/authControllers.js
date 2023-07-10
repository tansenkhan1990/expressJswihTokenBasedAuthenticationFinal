const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { revokeToken } = require("../middlewares/authMiddleware");

// Secret key for JWT token
const secretKey = process.env.JWT_SECRET;

// Function to generate a JWT token
function generateToken(user) {
  return jwt.sign({ id: user.id }, secretKey, { expiresIn: 24 * 60 * 60 });
}

// User login
exports.login = (req, res) => {
  const { username, password } = req.body;

  // Check if the provided username and password match the static user credentials
  if (username === "admin" && password === "password") {
    // Create a user object with an ID (you can also add additional user information here)
    const user = { id: 1 };

    // Generate a JWT token
    const token = generateToken(user);

    return res.json({ token });
  }

  // If the provided credentials are invalid
  return res.status(401).json({ error: "Invalid credentials" });
};

// User logout
exports.logout = (req, res) => {
  // Perform any logout-related actions if needed

  // Revoke the token
  revokeToken(req.headers.authorization);

  // In this case, simply clear the token from the client-side
  res.clearCookie("token");
  res.json({ message: "Logout successful" });
};

exports.private = (req, res) => {
  return res.status(401).json({ message: "this is private route" });
};

const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET;

// Maintain a list of revoked tokens
let revokedTokens = [];

// Middleware to verify JWT token
exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  // Check if the token exists and is not revoked
  if (!token || revokedTokens.includes(token)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Remove the "Bearer" prefix if present
    const formattedToken = token.replace("Bearer ", "");

    const decoded = jwt.verify(formattedToken, secretKey);

    // Check if the token has been revoked
    if (revokedTokens.includes(token)) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// Function to revoke a token
exports.revokeToken = (token) => {
  revokedTokens.push(token);
};

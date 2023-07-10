const jwt = require("jsonwebtoken");
const redis = require("redis");
const client = redis.createClient({
  host: "localhost",
  port: 6379,
});


const secretKey = process.env.JWT_SECRET;

// Handle Redis connection errors
client.on("error", (error) => {
  console.error("Redis connection error:", error);
});

// Middleware to verify JWT token
exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  // Check if the token exists and is not revoked
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Check if Redis client is connected
  if (!client.connected) {
    return res.status(500).json({ error: "Redis client is not connected" });
  }

  // Retrieve the token status from Redis
  client.get(token, (err, reply) => {
    if (err || !reply) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      // Remove the "Bearer" prefix if present
      const formattedToken = token.replace("Bearer ", "");

      const decoded = jwt.verify(formattedToken, secretKey);

      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ error: "Invalid token" });
    }
  });
};

// Function to revoke a token
exports.revokeToken = (token) => {
  // Check if Redis client is connected
  if (!client.connected) {
    console.error("Redis client is not connected");
    return;
  }

  // Store the token status in Redis
  client.set(token, "revoked", (err, reply) => {
    if (err) {
      console.error("Failed to revoke token:", err);
    } else {
      console.log("Token revoked:", token);
    }
  });
};

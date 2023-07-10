const express = require("express");
const router = express.Router();
const priavateController = require("../controllers/privateController");
const { verifyToken } = require("../middlewares/authMiddleware");

// Define routes
router.post("/", verifyToken, priavateController.getPrivate);

module.exports = router;

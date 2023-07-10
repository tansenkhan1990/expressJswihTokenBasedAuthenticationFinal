const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControllers');
const { verifyToken } = require('../middlewares/authMiddleware');


// POST /login
router.post('/login', authController.login);


// GET /logout
router.get('/logout', verifyToken, authController.logout);


module.exports = router;
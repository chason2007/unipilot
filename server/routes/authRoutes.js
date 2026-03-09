const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);

// We'll add middleware to protect 'me' soon
router.get('/me', (req, res, next) => {
    // Placeholder middleware logic to verify token
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ error: 'No token, authorization denied' });

    try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Token is not valid' });
    }
}, authController.getMe);

module.exports = router;

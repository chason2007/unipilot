const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { email, password, timezone } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create user
        const user = new User({
            email,
            passwordHash,
            preferences: { timezone: timezone || 'UTC' }
        });
        await user.save();

        // Generate token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });

        res.status(201).json({ token, user: { id: user._id, email: user.email, preferences: user.preferences } });
    } catch (error) {
        res.status(500).json({ error: 'Server error during registration' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });

        res.json({ token, user: { id: user._id, email: user.email, preferences: user.preferences } });
    } catch (error) {
        res.status(500).json({ error: 'Server error during login' });
    }
};

exports.getMe = async (req, res) => {
    try {
        // req.user will be set by our auth middleware
        const user = await User.findById(req.user.id).select('-passwordHash');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error getting user' });
    }
};

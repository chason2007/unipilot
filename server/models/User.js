const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  preferences: {
    timezone: { type: String, default: 'UTC' },
    notificationThresholds: [{ type: Number }], // e.g., [24, 2] (hours before due)
    pushToken: { type: String } // For mobile widget/notifications
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

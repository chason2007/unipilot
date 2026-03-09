const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    title: { type: String, required: true },
    category: { type: String, enum: ['Quiz', 'Project', 'Assignment', 'Exam', 'Reading', 'Other'], default: 'Other' },
    status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },

    // Date Management for flexibility and AI predictions
    originalDueDate: { type: Date },
    predictedDueDate: { type: Date }, // AI populates this if it's a 'tentative' syllabus date
    currentDueDate: { type: Date, required: true }, // The source of truth for the UI and Notifications

    isTentative: { type: Boolean, default: false }, // Flag for syllabus-scraped tasks vs user-confirmed
    confidenceScore: { type: Number, min: 0, max: 100 } // AI confidence for predicted tasks
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);

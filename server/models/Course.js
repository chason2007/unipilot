const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseName: { type: String, required: true }, // e.g., "Intro to Computer Science"
    courseCode: { type: String, required: true }, // e.g., "CS101"
    semester: { type: String, required: true },
    syllabusData: { type: mongoose.Schema.Types.Mixed } // Raw parsed JSON from syllabus
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);

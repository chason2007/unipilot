const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.post('/parse-voice', aiController.parseVoiceToTask);
// Future routes:
// router.post('/upload-syllabus', upload.single('syllabus'), aiController.parseSyllabus);

module.exports = router;

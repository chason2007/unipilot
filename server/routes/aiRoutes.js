const express = require('express');
const router = express.Router();
const multer = require('multer');
const aiController = require('../controllers/aiController');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/parse-voice', aiController.parseVoiceToTask);
router.post('/upload-syllabus', upload.single('syllabus'), aiController.parseSyllabus);

module.exports = router;

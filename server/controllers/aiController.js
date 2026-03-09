const Task = require('../models/Task');
const { scheduleReminder, cancelReminders } = require('../services/queueService');

exports.parseVoiceToTask = async (req, res) => {
    try {
        const { text, userTimezone } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'No text provided' });
        }

        console.log(`[AI Engine] Parsing request: "${text}" with TZ: ${userTimezone}`);

        const lowerText = text.toLowerCase();

        // Simulate AI Intent Detection
        let intent = 'CREATE';
        if (lowerText.includes('change') || lowerText.includes('move') || lowerText.includes('update') || lowerText.includes('delay')) {
            intent = 'UPDATE';
        } else if (lowerText.includes('delete') || lowerText.includes('remove') || lowerText.includes('cancel')) {
            intent = 'DELETE';
        }

        // Simulate Parsing logic
        let mockExtractedData = {};

        if (intent === 'CREATE') {
            const dueDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // Tomorrow
            mockExtractedData = {
                _id: 'mock-id-' + Date.now(), // Simulated DB ID needed for Queue
                title: "Generated from: " + text.substring(0, 20) + "...",
                currentDueDate: dueDate.toISOString(),
                category: lowerText.includes('quiz') ? 'Quiz' : (lowerText.includes('project') ? 'Project' : 'Assignment')
            };

            // Schedule reminder to fire 2 hours before the due date
            const delayMs = dueDate.getTime() - Date.now() - (2 * 60 * 60 * 1000);
            if (delayMs > 0) {
                await scheduleReminder(mockExtractedData, delayMs);
            }

        } else if (intent === 'UPDATE') {
            // Mocking target entity extraction ("the quiz", "history paper")
            mockExtractedData = {
                targetEntity: lowerText.replace(/(change|move|update|delay|to)/gi, '').trim(),
                newDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // Move out 3 days
            };
            // In a real DB scenario, we would `await cancelReminders(taskId)` here
            // and then reschedule it with the new date.

        } else if (intent === 'DELETE') {
            mockExtractedData = {
                targetEntity: lowerText.replace(/(delete|remove|cancel)/gi, '').trim()
            };
            // In a real DB scenario, we would `await cancelReminders(taskId)` here
        }

        return res.status(200).json({
            success: true,
            action: intent,
            data: mockExtractedData
        });

    } catch (error) {
        console.error("AI Parsing Error", error);
        res.status(500).json({ error: 'Failed to process AI task' });
    }
};

const pdfParse = require('pdf-parse');

exports.parseSyllabus = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No syllabus file uploaded' });
        }

        console.log(`[AI Engine] Parsing Syllabus PDF: ${req.file.originalname} (${req.file.size} bytes)`);

        // 1. Extract raw text from PDF
        const pdfData = await pdfParse(req.file.buffer);
        const rawText = pdfData.text;

        console.log(`[AI Engine] Extracted ${rawText.length} characters from PDF.`);

        // 2. Simulate AI Chunking & Parsing
        // Normally we'd send `rawText` to GPT-4o with instructions to extract a chronological list of assignments.

        // We will simulate the LLM finding 3 "Tentative" tasks from the syllabus
        const mockExtractedTasks = [
            {
                id: 'tentative-' + Date.now() + 1,
                title: 'Midterm Exam - Extracted from Syllabus',
                currentDueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks out
                category: 'Exam',
                isTentative: true,
                confidenceScore: 92
            },
            {
                id: 'tentative-' + Date.now() + 2,
                title: 'Final Term Paper - Extracted from Syllabus',
                currentDueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days out
                category: 'Project',
                isTentative: true,
                confidenceScore: 85
            },
            {
                id: 'tentative-' + Date.now() + 3,
                title: 'Weekly Reading Quiz 1 - Extracted from Syllabus',
                currentDueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Next week
                category: 'Quiz',
                isTentative: true,
                confidenceScore: 98
            }
        ];

        return res.status(200).json({
            success: true,
            message: 'Syllabus parsed successfully',
            tentativeTasks: mockExtractedTasks
        });

    } catch (error) {
        console.error("Syllabus Parsing Error", error);
        res.status(500).json({ error: 'Failed to parse syllabus' });
    }
};

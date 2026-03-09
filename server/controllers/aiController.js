const Task = require('../models/Task');

// In a real application, we would use the OpenAI or Google Gemini SDK.
// For the MVP, we will mock the LLM response to ensure the architecture works.
exports.parseVoiceToTask = async (req, res) => {
    try {
        const { text, userTimezone } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'No text provided' });
        }

        console.log(`[AI Engine] Parsing request: "${text}" with TZ: ${userTimezone}`);

        // ----- LLM STUB: Simulate OpenAI / Gemini API Call -----
        // const systemPrompt = `You are a scheduling assistant...`;
        // const response = await openai.chat.completions.create({...});

        // Simulating parsing logic: 
        // E.g., if user says "CS101 quiz tomorrow", we mock the output JSON
        const mockExtractedTask = {
            title: "Generated from: " + text.substring(0, 20) + "...",
            currentDueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
            category: text.toLowerCase().includes('quiz') ? 'Quiz' : (text.toLowerCase().includes('project') ? 'Project' : 'Assignment')
        };
        // -------------------------------------------------------------

        // Note: We would normally save this to the real DB, but since auth isn't wired up in the frontend yet (so no req.user.id), 
        // we return the parsed task directly to the frontend so it can be viewed on the Dashboard optimistically.

        /* 
          const newTask = new Task({
            userId: req.user.id,
            title: mockExtractedTask.title,
            currentDueDate: mockExtractedTask.currentDueDate,
            category: mockExtractedTask.category
          });
          await newTask.save();
        */

        return res.status(200).json({
            success: true,
            task: mockExtractedTask
        });

    } catch (error) {
        console.error("AI Parsing Error", error);
        res.status(500).json({ error: 'Failed to process AI task' });
    }
};

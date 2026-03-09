import { useState, useRef } from 'react';
import { Mic, Send, Loader2 } from 'lucide-react';

const TaskInput = ({ onTaskCreated }) => {
    const [inputText, setInputText] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const recognitionRef = useRef(null);

    const startListening = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("Your browser doesn't support speech recognition.");
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognitionRef.current = recognition;
        recognition.continuous = false;
        recognition.interimResults = true;

        recognition.onstart = () => setIsListening(true);

        recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join('');
            setInputText(transcript);
        };

        recognition.onerror = (event) => {
            console.error(event.error);
            setIsListening(false);
        };

        recognition.onend = () => setIsListening(false);
        recognition.start();
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        setIsLoading(true);
        try {
            // Stubbing the API call to aiController
            const response = await fetch('http://localhost:5000/api/ai/parse-voice', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: inputText, userTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone })
            });

            const data = await response.json();
            onTaskCreated(data.task);
            setInputText('');
        } catch (error) {
            console.error("Failed to parse task", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-3 transition-shadow focus-within:shadow-md focus-within:border-primary-500">
            <button
                type="button"
                onMouseDown={startListening}
                onMouseUp={stopListening}
                onTouchStart={startListening}
                onTouchEnd={stopListening}
                className={`p-3 rounded-full transition-colors ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'}`}
            >
                <Mic size={20} />
            </button>

            <form onSubmit={handleSubmit} className="flex-1 flex items-center gap-2">
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Hold the mic to speak, or type a task... (e.g. 'CS101 quiz tomorrow')"
                    className="flex-1 bg-transparent border-none outline-none text-slate-700 placeholder:text-slate-400 font-medium"
                />
                <button
                    type="submit"
                    disabled={!inputText.trim() || isLoading}
                    className="p-3 bg-primary-600 text-white rounded-full hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                </button>
            </form>
        </div>
    );
};

export default TaskInput;

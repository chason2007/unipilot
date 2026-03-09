import { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const SyllabusUpload = ({ onTasksExtracted }) => {
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [tentativeTasks, setTentativeTasks] = useState([]);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('syllabus', file);

        try {
            const response = await fetch('http://localhost:5000/api/ai/upload-syllabus', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();

            if (data.success && data.tentativeTasks) {
                setTentativeTasks(data.tentativeTasks);
            }
        } catch (error) {
            console.error("Failed to upload syllabus", error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleApprove = (task) => {
        onTasksExtracted({ ...task, isTentative: false });
        setTentativeTasks(prev => prev.filter(t => t.id !== task.id));
    };

    const handleReject = (taskId) => {
        setTentativeTasks(prev => prev.filter(t => t.id !== taskId));
    };

    const handleApproveAll = () => {
        tentativeTasks.forEach(task => onTasksExtracted({ ...task, isTentative: false }));
        setTentativeTasks([]);
    };

    return (
        <div className="w-full">
            {tentativeTasks.length === 0 ? (
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-md p-6 text-white relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                    <h3 className="font-bold text-lg mb-2 relative z-10 flex items-center gap-2">
                        <FileText size={20} /> Syllabus Sync
                    </h3>
                    <p className="text-indigo-100 text-sm mb-4 relative z-10">Upload a PDF syllabus and let Ai extract all your deadlines automatically.</p>

                    <input
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />

                    {file ? (
                        <div className="flex items-center justify-between bg-white/10 rounded-xl p-3 mb-3">
                            <span className="text-sm truncate mr-2">{file.name}</span>
                            <button
                                onClick={handleUpload}
                                disabled={isUploading}
                                className="bg-white text-indigo-700 font-semibold py-1.5 px-4 rounded-lg shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2"
                            >
                                {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                                {isUploading ? 'Parsing...' : 'Sync'}
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => fileInputRef.current.click()}
                            className="w-full bg-white text-indigo-700 font-semibold py-2 rounded-xl shadow-sm hover:bg-slate-50 transition-colors relative z-10 flex justify-center items-center gap-2"
                        >
                            <FileText size={18} /> Select PDF
                        </button>
                    )}
                </div>
            ) : (
                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                        <h4 className="font-bold text-indigo-900 text-sm">Review Extracted Tasks</h4>
                        <button
                            onClick={handleApproveAll}
                            className="text-xs font-semibold bg-indigo-600 text-white px-3 py-1.5 rounded bg-indigo-700 transition"
                        >
                            Approve All
                        </button>
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                        {tentativeTasks.map(task => (
                            <div key={task.id} className="bg-white p-3 rounded border border-indigo-100 flex items-start justify-between gap-2 shadow-sm">
                                <div>
                                    <p className="text-sm font-semibold text-slate-800 line-clamp-1" title={task.title}>{task.title}</p>
                                    <p className="text-xs text-slate-500">{new Date(task.currentDueDate).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                    <button onClick={() => handleApprove(task)} className="text-emerald-600 hover:text-emerald-700 bg-emerald-50 p-1.5 rounded" title="Approve">
                                        <CheckCircle size={16} />
                                    </button>
                                    <button onClick={() => handleReject(task.id)} className="text-slate-400 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 p-1.5 rounded" title="Reject">
                                        <XCircle size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SyllabusUpload;

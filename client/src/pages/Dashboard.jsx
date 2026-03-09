import { useState } from 'react';
import { Calendar as CalendarIcon, ListStyle, Clock, Tag } from 'lucide-react';
import TaskInput from '../components/TaskInput';

const mockTasks = [
    { id: 1, title: 'Read Chapter 4 of Intro to Psychology', dueDate: '2026-03-10T14:00:00', category: 'Reading', priority: 'High', course: 'PSY101' },
    { id: 2, title: 'Calculus Midterm Assignment', dueDate: '2026-03-12T23:59:00', category: 'Assignment', priority: 'High', course: 'MATH201' },
    { id: 3, title: 'Draft Research Paper', dueDate: '2026-03-20T17:00:00', category: 'Project', priority: 'Medium', course: 'HIST105' }
];

const categoryColors = {
    Reading: 'bg-blue-100 text-blue-700',
    Assignment: 'bg-orange-100 text-orange-700',
    Project: 'bg-purple-100 text-purple-700',
    Quiz: 'bg-red-100 text-red-700',
    Exam: 'bg-red-200 text-red-800 font-bold',
    Other: 'bg-slate-100 text-slate-700'
};

const Dashboard = () => {
    const [tasks, setTasks] = useState(mockTasks);

    const handleTaskCreated = (newTaskParams) => {
        // Optimistic UI update
        const newTask = {
            id: Date.now(),
            title: newTaskParams.title,
            dueDate: newTaskParams.currentDueDate,
            category: newTaskParams.category,
            priority: 'Medium',
            course: 'Pending Match...'
        };
        setTasks([newTask, ...tasks]);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Top Navigation Bar */}
            <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-lg">U</div>
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">UniPilot</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
                        <span className="text-sm font-semibold text-slate-600">JD</span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-5xl w-full mx-auto p-6 flex flex-col gap-8">

                {/* Floating Input Section */}
                <section className="mt-8 flex flex-col items-center text-center">
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-2">What's on your mind?</h2>
                    <p className="text-slate-500 mb-8 max-w-lg">Add assignments using natural language or voice. We'll handle the scheduling, reminders, and syllabus parsing.</p>
                    <TaskInput onTaskCreated={handleTaskCreated} />
                </section>

                {/* Overview & upcoming Tasks */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">

                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <CalendarIcon className="text-primary-500" /> Upcoming Deadlines
                            </h3>
                            <button className="text-sm font-medium text-primary-600 hover:text-primary-700">View All</button>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden divide-y divide-slate-100">
                            {tasks.length === 0 ? (
                                <div className="p-8 text-center text-slate-500">No upcoming tasks! You're free!</div>
                            ) : (
                                tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)).map(task => (
                                    <div key={task.id} className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-4 group">
                                        <div className="mt-1 w-5 h-5 rounded border-2 border-slate-300 flex-shrink-0 group-hover:border-primary-400 cursor-pointer"></div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className="font-semibold text-slate-900 line-clamp-1">{task.title}</h4>
                                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${categoryColors[task.category] || categoryColors.Other}`}>
                                                    {task.category}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                                <span className="flex items-center gap-1"><Clock size={14} className="text-slate-400" /> {new Date(task.dueDate).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
                                                <span className="flex items-center gap-1"><Tag size={14} className="text-slate-400" /> {task.course}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-indigo-500 to-primary-600 rounded-2xl shadow-md p-6 text-white">
                            <h3 className="font-bold text-lg mb-2">Syllabus Sync</h3>
                            <p className="text-indigo-100 text-sm mb-4">Upload a PDF syllabus and let Ai extract all your deadlines automatically.</p>
                            <button className="w-full bg-white text-primary-700 font-semibold py-2 rounded-xl shadow-sm hover:bg-slate-50 transition-colors">
                                Upload PDF
                            </button>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                            <h3 className="font-bold text-slate-800 mb-4">Course Highlights</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-600 font-medium tracking-wide">MATH201</span>
                                    <span className="text-rose-500 font-bold bg-rose-50 px-2 py-1 rounded">2 Tasks Due</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-600 font-medium tracking-wide">CS101</span>
                                    <span className="text-slate-400 font-medium">All caught up</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default Dashboard;

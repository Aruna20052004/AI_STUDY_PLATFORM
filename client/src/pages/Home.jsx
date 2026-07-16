import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

function Home() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("student");

    useEffect(() => {

        fetch(`${API_URL}/`)
            .then((res) => res.json())
            .then((data) => console.log(data));

    }, []);
    return (

        <div className="min-h-screen bg-zinc-900 text-white">

            <Navbar />

            <div className="flex flex-col items-center justify-center text-center px-6 pt-32">

                <h1 className="text-6xl font-bold leading-tight">
                    Learn Smarter With <span className="text-blue-500">AI</span>
                </h1>

                <p className="mt-6 text-zinc-400 text-lg max-w-2xl">
                    Your personal AI-powered study platform to organize notes,
                    boost productivity, and learn efficiently.
                </p>

                <div className="mt-8 flex gap-4">

                    <button
                        onClick={() => navigate("/signup")}
                        className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-xl text-lg font-semibold transition duration-300 hover:scale-105"
                    >
                        Get Started
                    </button>

                    <button
                        onClick={() => {

                            document
                                .getElementById("detailed-info")
                                .scrollIntoView({
                                    behavior: "smooth",
                                });

                        }}
                        className="border border-zinc-600 hover:border-blue-500 px-6 py-3 rounded-xl text-lg transition duration-300 hover:scale-105"
                    >
                        Learn More
                    </button>

                </div>

            </div>
            <div
                id="features"
                className="mt-32 px-6 pb-20"
            >

                <h2 className="text-5xl font-bold text-center mb-16">
                    Platform Features 🚀
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    <div className="bg-zinc-800 p-8 rounded-2xl hover:scale-105 transition duration-300">

                        <h3 className="text-2xl font-bold text-blue-400 mb-4">
                            Smart Notes
                        </h3>

                        <p className="text-zinc-400">
                            Create, edit, and organize your study notes efficiently.
                        </p>

                    </div>

                    <div className="bg-zinc-800 p-8 rounded-2xl hover:scale-105 transition duration-300">

                        <h3 className="text-2xl font-bold text-green-400 mb-4">
                            Task Manager
                        </h3>

                        <p className="text-zinc-400">
                            Track your daily study goals and productivity tasks.
                        </p>

                    </div>

                    <div className="bg-zinc-800 p-8 rounded-2xl hover:scale-105 transition duration-300">

                        <h3 className="text-2xl font-bold text-purple-400 mb-4">
                            AI Assistant
                        </h3>

                        <p className="text-zinc-400">
                            Get AI-powered learning support and quick answers.
                        </p>

                    </div>

                </div>

            </div>

            {/* Platform Deep Dive Section */}
            <div id="detailed-info" className="mt-16 px-6 pb-32 max-w-5xl mx-auto border-t border-zinc-800 pt-20">
                <h2 className="text-4xl font-extrabold text-center mb-4">
                    Platform Deep Dive 🔍
                </h2>
                <p className="text-zinc-400 text-center mb-12 max-w-xl mx-auto">
                    Explore how AI Study Platform helps both students and administrators excel.
                </p>

                {/* Tabs */}
                <div className="flex flex-wrap justify-center gap-4 mb-10">
                    <button
                        onClick={() => setActiveTab("student")}
                        className={`px-5 py-2.5 rounded-xl font-semibold transition duration-300 cursor-pointer ${
                            activeTab === "student" ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                        }`}
                    >
                        👨‍🎓 Student Experience
                    </button>
                    <button
                        onClick={() => setActiveTab("admin")}
                        className={`px-5 py-2.5 rounded-xl font-semibold transition duration-300 cursor-pointer ${
                            activeTab === "admin" ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                        }`}
                    >
                        👮 Admin Management
                    </button>
                    <button
                        onClick={() => setActiveTab("ai")}
                        className={`px-5 py-2.5 rounded-xl font-semibold transition duration-300 cursor-pointer ${
                            activeTab === "ai" ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                        }`}
                    >
                        ⚡ AI Technology
                    </button>
                </div>

                {/* Content Box */}
                <div className="bg-zinc-800/55 p-8 rounded-3xl border border-zinc-800 shadow-xl transition-all duration-500">
                    {activeTab === "student" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <div>
                                <h3 className="text-3xl font-bold text-blue-400 mb-4">Student Mode</h3>
                                <p className="text-zinc-300 leading-relaxed mb-6 font-medium">
                                    Our isolated student experience allows you to manage your notes and checklist goals completely securely. No data leaks, no distractions.
                                </p>
                                <ul className="space-y-3 text-zinc-400 text-sm font-semibold">
                                    <li className="flex items-center gap-2">✅ Personal isolated task list with toggling.</li>
                                    <li className="flex items-center gap-2">📝 Full note manager to compile your class syllabus.</li>
                                    <li className="flex items-center gap-2">💬 Secure access to your private AI Assistant history.</li>
                                </ul>
                            </div>
                            <div className="bg-zinc-900/60 p-6 rounded-2xl border border-zinc-800 font-mono text-xs text-zinc-500 space-y-4">
                                <div className="border-b border-zinc-850 pb-2 flex justify-between">
                                    <span>student_dashboard.json</span>
                                    <span className="text-blue-500 font-bold">ACTIVE</span>
                                </div>
                                <p className="text-zinc-400">"studentId": "6a05b1440af3625405a542c6"</p>
                                <p className="text-zinc-400">"notes_count": 8,</p>
                                <p className="text-zinc-400">"tasks_completed": "75%"</p>
                                <div className="text-center text-zinc-500 bg-zinc-850 py-2 rounded-lg border border-zinc-800">
                                    Student workspace verified successfully
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "admin" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <div>
                                <h3 className="text-3xl font-bold text-green-400 mb-4">Admin Mode</h3>
                                <p className="text-zinc-300 leading-relaxed mb-6 font-medium">
                                    Designed for organizers, teachers, and system administrators. The portal gives total control over the platform data and metrics.
                                </p>
                                <ul className="space-y-3 text-zinc-400 text-sm font-semibold">
                                    <li className="flex items-center gap-2">📊 Live analytics dashboard tracking completion rates.</li>
                                    <li className="flex items-center gap-2">👥 Full User List with cascade data deletion.</li>
                                    <li className="flex items-center gap-2">📝 Global review of all created notes and task objectives.</li>
                                </ul>
                            </div>
                            <div className="bg-zinc-900/60 p-6 rounded-2xl border border-zinc-800 font-mono text-xs text-zinc-500 space-y-4">
                                <div className="border-b border-zinc-850 pb-2 flex justify-between">
                                    <span>admin_analytics.json</span>
                                    <span className="text-green-500 font-bold">READY</span>
                                </div>
                                <p className="text-zinc-400">"total_registered_students": 254,</p>
                                <p className="text-zinc-400">"ai_chats_logged": 1942,</p>
                                <p className="text-zinc-400">"system_load_status": "Optimal"</p>
                                <div className="text-center text-zinc-500 bg-green-500/10 text-green-400 py-2 rounded-lg border border-green-500/20">
                                    Admin privileges active
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "ai" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <div>
                                <h3 className="text-3xl font-bold text-purple-400 mb-4">AI Technology</h3>
                                <p className="text-zinc-300 leading-relaxed mb-6 font-medium">
                                    Powered by Gemini 2.5 Flash, the assistant parses study queries in milliseconds. Responses are calibrated to be extremely crisp, concise, and focused.
                                </p>
                                <ul className="space-y-3 text-zinc-400 text-sm font-semibold">
                                    <li className="flex items-center gap-2">⚡ Extremely low latency using Gemini 2.5 architecture.</li>
                                    <li className="flex items-center gap-2">🤖 Conversational history persisted directly to MongoDB.</li>
                                    <li className="flex items-center gap-2">🎯 Clear response tuning to prevent output clutter.</li>
                                </ul>
                            </div>
                            <div className="bg-zinc-900/60 p-6 rounded-2xl border border-zinc-800 font-mono text-xs text-zinc-500 space-y-4">
                                <div className="border-b border-zinc-850 pb-2 flex justify-between">
                                    <span>gemini_prompt.config</span>
                                    <span className="text-purple-500 font-bold">STUNNING</span>
                                </div>
                                <p className="text-zinc-400">"model": "gemini-2.5-flash"</p>
                                <p className="text-zinc-400">"response_style": "Concise & Onto the point"</p>
                                <p className="text-zinc-400">"chat_persistence": true</p>
                                <div className="text-center text-zinc-500 bg-purple-500/10 text-purple-400 py-2 rounded-lg border border-purple-500/20">
                                    AI prompt pipeline optimized
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </div>


    );
}

export default Home;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { API_URL } from "../config";

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("analytics");
    const [analytics, setAnalytics] = useState(null);
    const [users, setUsers] = useState([]);
    const [notes, setNotes] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [chats, setChats] = useState([]);
    const [noteSearch, setNoteSearch] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAnalytics();
        fetchUsers();
        fetchNotes();
        fetchTasks();
        fetchChats();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const res = await fetch(`${API_URL}/api/admin/analytics`, {
                headers: { Authorization: localStorage.getItem("token") },
            });
            if (res.ok) {
                const data = await res.ok ? await res.json() : {};
                setAnalytics(data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await fetch(`${API_URL}/api/admin/users`, {
                headers: { Authorization: localStorage.getItem("token") },
            });
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchNotes = async (searchVal = "") => {
        try {
            const res = await fetch(`${API_URL}/api/admin/notes?search=${encodeURIComponent(searchVal)}`, {
                headers: { Authorization: localStorage.getItem("token") },
            });
            if (res.ok) {
                const data = await res.json();
                setNotes(data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchTasks = async () => {
        try {
            const res = await fetch(`${API_URL}/api/admin/tasks`, {
                headers: { Authorization: localStorage.getItem("token") },
            });
            if (res.ok) {
                const data = await res.json();
                setTasks(data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchChats = async () => {
        try {
            const res = await fetch(`${API_URL}/api/admin/chats`, {
                headers: { Authorization: localStorage.getItem("token") },
            });
            if (res.ok) {
                const data = await res.json();
                setChats(data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const deleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user? All associated notes, tasks, and chats will be deleted!")) return;
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/api/admin/users/${userId}`, {
                method: "DELETE",
                headers: { Authorization: localStorage.getItem("token") },
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(data.message);
                fetchUsers();
                fetchAnalytics();
                fetchNotes();
                fetchTasks();
                fetchChats();
            } else {
                toast.error(data.message || "Failed to delete user");
            }
        } catch (err) {
            console.error(err);
            toast.error("Error deleting user");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/");
    };

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setNoteSearch(val);
        fetchNotes(val);
    };

    return (
        <div className="min-h-screen md:h-screen md:overflow-hidden bg-zinc-900 text-white flex flex-col md:flex-row font-sans">
            {/* Sidebar */}
            <div className="w-full md:w-64 bg-zinc-950 p-6 border-b md:border-b-0 md:border-r border-zinc-800 flex flex-col justify-between md:h-full">
                <div>
                    <h1 className="text-3xl font-bold text-blue-500 mb-2">
                        AI Study
                    </h1>
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold border border-blue-500/30">
                        Admin Portal
                    </span>

                    <ul className="space-y-4 text-base mt-10">
                        <li
                            onClick={() => setActiveTab("analytics")}
                            className={`px-4 py-3 rounded-xl cursor-pointer transition duration-200 flex items-center gap-3 ${
                                activeTab === "analytics" ? "bg-blue-600 text-white font-semibold" : "hover:bg-zinc-800 text-zinc-400"
                            }`}
                        >
                            📊 Analytics Overview
                        </li>
                        <li
                            onClick={() => setActiveTab("users")}
                            className={`px-4 py-3 rounded-xl cursor-pointer transition duration-200 flex items-center gap-3 ${
                                activeTab === "users" ? "bg-blue-600 text-white font-semibold" : "hover:bg-zinc-800 text-zinc-400"
                            }`}
                        >
                            👥 User Management
                        </li>
                        <li
                            onClick={() => setActiveTab("notes")}
                            className={`px-4 py-3 rounded-xl cursor-pointer transition duration-200 flex items-center gap-3 ${
                                activeTab === "notes" ? "bg-blue-600 text-white font-semibold" : "hover:bg-zinc-800 text-zinc-400"
                            }`}
                        >
                            📝 Student Notes
                        </li>
                        <li
                            onClick={() => setActiveTab("tasks")}
                            className={`px-4 py-3 rounded-xl cursor-pointer transition duration-200 flex items-center gap-3 ${
                                activeTab === "tasks" ? "bg-blue-600 text-white font-semibold" : "hover:bg-zinc-800 text-zinc-400"
                            }`}
                        >
                            ✅ Student Tasks
                        </li>
                        <li
                            onClick={() => setActiveTab("chats")}
                            className={`px-4 py-3 rounded-xl cursor-pointer transition duration-200 flex items-center gap-3 ${
                                activeTab === "chats" ? "bg-blue-600 text-white font-semibold" : "hover:bg-zinc-800 text-zinc-400"
                            }`}
                        >
                            🤖 AI Chat Logs
                        </li>
                    </ul>
                </div>

                <div className="mt-8">
                    <button
                        onClick={handleLogout}
                        className="w-full text-center bg-red-600/10 border border-red-500/30 text-red-400 hover:bg-red-600 hover:text-white py-3 rounded-xl font-semibold transition duration-300"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Area */}
            <div className="flex-1 p-8 md:p-12 md:overflow-y-auto md:h-full">
                {activeTab === "analytics" && (
                    <div>
                        <h2 className="text-3xl font-extrabold mb-8 flex items-center gap-3">
                            Analytics Overview 🚀
                        </h2>
                        {analytics ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="bg-zinc-800 p-6 rounded-2xl border border-zinc-700 hover:border-blue-500 transition duration-300">
                                    <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Total Students</h3>
                                    <p className="text-5xl font-black text-blue-500 mt-2">{analytics.totalStudents}</p>
                                </div>
                                <div className="bg-zinc-800 p-6 rounded-2xl border border-zinc-700 hover:border-blue-500 transition duration-300">
                                    <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Total Admins</h3>
                                    <p className="text-5xl font-black text-indigo-500 mt-2">{analytics.totalAdmins}</p>
                                </div>
                                <div className="bg-zinc-800 p-6 rounded-2xl border border-zinc-700 hover:border-blue-500 transition duration-300">
                                    <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Total Notes Created</h3>
                                    <p className="text-5xl font-black text-yellow-500 mt-2">{analytics.totalNotes}</p>
                                </div>
                                <div className="bg-zinc-800 p-6 rounded-2xl border border-zinc-700 hover:border-blue-500 transition duration-300">
                                    <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Total Tasks</h3>
                                    <p className="text-5xl font-black text-purple-500 mt-2">{analytics.totalTasks}</p>
                                </div>
                                <div className="bg-zinc-800 p-6 rounded-2xl border border-zinc-700 hover:border-blue-500 transition duration-300">
                                    <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Completed Tasks</h3>
                                    <p className="text-5xl font-black text-green-500 mt-2">
                                        {analytics.completedTasks}
                                        <span className="text-base font-normal text-zinc-400 ml-2">
                                            ({analytics.totalTasks > 0 ? Math.round((analytics.completedTasks / analytics.totalTasks) * 100) : 0}%)
                                        </span>
                                    </p>
                                </div>
                                <div className="bg-zinc-800 p-6 rounded-2xl border border-zinc-700 hover:border-blue-500 transition duration-300">
                                    <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">AI Questions Asked</h3>
                                    <p className="text-5xl font-black text-pink-500 mt-2">{analytics.totalChats}</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-zinc-500">Loading metrics...</p>
                        )}
                    </div>
                )}

                {activeTab === "users" && (
                    <div>
                        <h2 className="text-3xl font-extrabold mb-8">User Management 👥</h2>
                        <div className="bg-zinc-800 rounded-2xl overflow-hidden border border-zinc-700">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-zinc-950 text-zinc-300 font-semibold border-b border-zinc-700">
                                            <th className="p-4">Username</th>
                                            <th className="p-4">Email</th>
                                            <th className="p-4">Role</th>
                                            <th className="p-4">Joined At</th>
                                            <th className="p-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-700">
                                        {users.length > 0 ? (
                                            users.map((user) => (
                                                <tr key={user._id} className="hover:bg-zinc-750/55 transition">
                                                    <td className="p-4 font-medium">{user.username}</td>
                                                    <td className="p-4 text-zinc-300">{user.email}</td>
                                                    <td className="p-4">
                                                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                                            user.role === "admin" ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                                        }`}>
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-zinc-400 text-sm">
                                                        {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                                                    </td>
                                                    <td className="p-4">
                                                        <button
                                                            onClick={() => deleteUser(user._id)}
                                                            disabled={loading}
                                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm transition font-medium disabled:opacity-50"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="p-8 text-center text-zinc-500">No users found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "notes" && (
                    <div>
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
                            <h2 className="text-3xl font-extrabold">Student Notes 📝</h2>
                            <input
                                type="text"
                                placeholder="Search by title or content..."
                                value={noteSearch}
                                onChange={handleSearchChange}
                                className="p-3 w-full sm:w-80 rounded-xl bg-zinc-800 text-white outline-none border border-zinc-700 focus:border-blue-500"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {notes.length > 0 ? (
                                notes.map((note) => (
                                    <div key={note._id} className="bg-zinc-800 p-6 rounded-2xl border border-zinc-700 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start gap-4 mb-3">
                                                <h3 className="text-xl font-bold">{note.title}</h3>
                                                <span className="text-xs bg-zinc-750 text-zinc-400 px-2 py-1 rounded">
                                                    By: {note.studentId?.username || "Unknown Student"}
                                                </span>
                                            </div>
                                            <p className="text-zinc-300 whitespace-pre-wrap leading-relaxed">{note.content}</p>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-zinc-750 text-zinc-500 text-xs flex justify-between">
                                            <span>Email: {note.studentId?.email || "N/A"}</span>
                                            <span>{new Date(note.createdAt || Date.now()).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-zinc-500 col-span-2">No notes match the criteria.</p>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === "tasks" && (
                    <div>
                        <h2 className="text-3xl font-extrabold mb-8">Student Tasks ✅</h2>
                        <div className="space-y-4">
                            {tasks.length > 0 ? (
                                tasks.map((task) => (
                                    <div key={task._id} className="bg-zinc-800 p-5 rounded-2xl border border-zinc-700 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                        <div>
                                            <h3 className={`text-lg font-semibold ${task.completed ? "line-through text-zinc-500" : "text-white"}`}>
                                                {task.title}
                                            </h3>
                                            <p className="text-xs text-zinc-400 mt-1">
                                                Assigned To: <span className="text-blue-400 font-medium">{task.studentId?.username || "Unknown"}</span> ({task.studentId?.email || "N/A"})
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold self-start sm:self-auto border ${
                                            task.completed ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                        }`}>
                                            {task.completed ? "Completed" : "Pending"}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-zinc-500">No tasks created yet.</p>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === "chats" && (
                    <div>
                        <h2 className="text-3xl font-extrabold mb-8">AI Chat Logs 🤖</h2>
                        <div className="space-y-6">
                            {chats.length > 0 ? (
                                chats.map((chat) => (
                                    <div key={chat._id} className="bg-zinc-800 p-6 rounded-2xl border border-zinc-700">
                                        <div className="flex justify-between text-xs text-zinc-400 mb-4 pb-2 border-b border-zinc-750">
                                            <span>
                                                Student: <span className="text-blue-400 font-medium">{chat.studentId?.username || "Unknown"}</span> ({chat.studentId?.email || "N/A"})
                                            </span>
                                            <span>{new Date(chat.createdAt || Date.now()).toLocaleString()}</span>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="bg-zinc-900 p-3 rounded-lg border border-zinc-750">
                                                <strong className="text-blue-400 text-xs uppercase tracking-wider block mb-1">User Question</strong>
                                                <p className="text-sm">{chat.question}</p>
                                            </div>
                                            <div className="bg-zinc-750/30 p-3 rounded-lg border border-zinc-700/50">
                                                <strong className="text-purple-400 text-xs uppercase tracking-wider block mb-1">AI Answer</strong>
                                                <p className="text-sm whitespace-pre-wrap leading-relaxed">{chat.answer}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-zinc-500">No AI chats logged yet.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

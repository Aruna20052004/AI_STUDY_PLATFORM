import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { API_URL } from "../config";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

function Dashboard() {
    const navigate = useNavigate();

    const [noteData, setNoteData] = useState({
        title: "",
        content: "",
    });

    const [notes, setNotes] = useState([]);
    const [taskTitle, setTaskTitle] = useState("");
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editId, setEditId] = useState(null);

    const [profile, setProfile] = useState(null);
    const [isListening, setIsListening] = useState({
        noteTitle: false,
        noteContent: false,
        taskTitle: false
    });
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        fetchProfile();
        fetchNotes();
        fetchTasks();
    }, [navigate]);

    const handleChange = (e) => {
        setNoteData({
            ...noteData,
            [e.target.name]: e.target.value,
        });
    };

    const fetchProfile = async () => {
        try {
            const response = await fetch(`${API_URL}/api/users/profile`, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            });

            const data = await response.json();
            if (response.ok) {
                setProfile(data);
            } else {
                console.log("Profile fetch failed:", data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const startSpeechRecognition = (field) => {
        if (!recognition) {
            toast.error("Speech Recognition is not supported in this browser.");
            return;
        }

        if (isListening[field]) {
            recognition.stop();
            return;
        }

        try {
            recognition.stop();
        } catch (e) {}

        setIsListening({
            noteTitle: false,
            noteContent: false,
            taskTitle: false,
            [field]: true
        });

        if (field === "noteTitle") {
            setNoteData((prev) => ({ ...prev, title: "" }));
        } else if (field === "noteContent") {
            setNoteData((prev) => ({ ...prev, content: "" }));
        } else if (field === "taskTitle") {
            setTaskTitle("");
        }

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            if (field === "noteTitle") {
                setNoteData((prev) => ({ ...prev, title: transcript }));
            } else if (field === "noteContent") {
                setNoteData((prev) => ({ ...prev, content: transcript }));
            } else if (field === "taskTitle") {
                setTaskTitle(transcript);
            }
        };

        recognition.onend = () => {
            setIsListening((prev) => ({ ...prev, [field]: false }));
        };

        recognition.onerror = (event) => {
            console.error(event.error);
            setIsListening((prev) => ({ ...prev, [field]: false }));
            toast.error(`Speech error: ${event.error}`);
        };

        recognition.start();
    };

    const fetchNotes = async () => {
        try {
            const response = await fetch(`${API_URL}/api/notes`, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            });

            const data = await response.json();
            if (Array.isArray(data)) {
                setNotes(data);
            } else {
                setNotes([]);
                console.log("Notes error:", data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchTasks = async () => {
        try {
            const response = await fetch(`${API_URL}/api/tasks`, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            });

            const data = await response.json();
            if (Array.isArray(data)) {
                setTasks(data);
            } else {
                setTasks([]);
                console.log("Tasks error:", data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = editId
                ? `${API_URL}/api/notes/${editId}`
                : `${API_URL}/api/notes/create`;

            const method = editId ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("token"),
                },
                body: JSON.stringify(noteData),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);

                setNoteData({
                    title: "",
                    content: "",
                });

                setEditId(null);
                await fetchNotes();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const deleteNote = async (id) => {
        try {
            const response = await fetch(`${API_URL}/api/notes/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
                fetchNotes();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const editNote = (note) => {
        setNoteData({
            title: note.title,
            content: note.content,
        });

        setEditId(note._id);

        document.getElementById("notes").scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
    };

    const addTask = async () => {
        if (!taskTitle.trim()) return;

        try {
            const response = await fetch(`${API_URL}/api/tasks/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("token"),
                },
                body: JSON.stringify({
                    title: taskTitle,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
                setTaskTitle("");
                fetchTasks();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const toggleTask = async (id) => {
        try {
            const response = await fetch(`${API_URL}/api/tasks/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
                fetchTasks();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const deleteTask = async (id) => {
        try {
            const response = await fetch(`${API_URL}/api/tasks/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
                fetchTasks();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/");
    };

    const completedTasks = tasks.filter((task) => task.completed).length;

    return (
        <div className="min-h-screen md:h-screen md:overflow-hidden bg-zinc-900 text-white flex flex-col md:flex-row">
            <div className="w-full md:w-64 bg-zinc-950 p-6 border-b md:border-b-0 md:border-r border-zinc-800 md:h-full">
                <h1 className="text-3xl font-bold text-blue-500 mb-10">
                    AI Study
                </h1>

                <ul className="space-y-6 text-lg">
                    <li className="hover:text-blue-400 cursor-pointer transition duration-300 hover:translate-x-2">
                        Dashboard
                    </li>

                    <li
                        onClick={() =>
                            document.getElementById("notes").scrollIntoView({
                                behavior: "smooth",
                                block: "center",
                            })
                        }
                        className="hover:text-blue-400 cursor-pointer transition duration-300 hover:translate-x-2"
                    >
                        Notes
                    </li>

                    <li
                        onClick={() =>
                            document.getElementById("tasks").scrollIntoView({
                                behavior: "smooth",
                                block: "center",
                            })
                        }
                        className="hover:text-blue-400 cursor-pointer transition duration-300 hover:translate-x-2"
                    >
                        Tasks
                    </li>

                    <li
                        onClick={() => navigate("/ai")}
                        className="hover:text-blue-400 cursor-pointer transition duration-300 hover:translate-x-2"
                    >
                        AI Assistant
                    </li>

                    <li
                        onClick={handleLogout}
                        className="hover:text-red-400 cursor-pointer transition duration-300 hover:translate-x-2"
                    >
                        Logout
                    </li>
                </ul>
            </div>

            <div className="flex-1 p-10 md:overflow-y-auto md:h-full">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 pb-6 border-b border-zinc-800">
                    <div>
                        <h1 className="text-4xl font-bold">
                            Welcome Back, {profile?.username || "Student"} 👋
                        </h1>
                        <p className="text-zinc-400 text-sm mt-1">
                            Role: <span className="capitalize text-blue-400 font-semibold">{profile?.role || "student"}</span>
                        </p>
                    </div>
                    {profile && (
                        <div className="bg-zinc-800/50 p-4 rounded-2xl border border-zinc-800 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-xl font-bold text-white shadow-lg">
                                {profile.username[0].toUpperCase()}
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-base leading-tight">{profile.username}</h3>
                                <p className="text-zinc-500 text-xs mt-0.5">{profile.email}</p>
                            </div>
                        </div>
                    )}
                </div>

                <form
                    id="notes"
                    onSubmit={handleSubmit}
                    className="bg-zinc-800 p-6 rounded-2xl mt-8 flex flex-col gap-4 max-w-xl"
                >
                    <h2 className="text-2xl font-semibold">
                        {editId ? "Update Note" : "Create Note"}
                    </h2>

                    <div className="relative flex items-center">
                        <input
                            type="text"
                            name="title"
                            placeholder="Enter Note Title"
                            value={noteData.title}
                            onChange={handleChange}
                            className="p-3 pr-10 rounded-lg bg-zinc-700 text-white outline-none placeholder:text-zinc-400 w-full"
                        />
                        {recognition && (
                            <button
                                type="button"
                                onClick={() => startSpeechRecognition("noteTitle")}
                                className={`absolute right-3 p-1 rounded-full hover:bg-zinc-600 transition duration-200 cursor-pointer ${
                                    isListening.noteTitle ? "text-red-500 animate-pulse" : "text-zinc-400"
                                }`}
                                title="Speech to text"
                            >
                                🎤
                            </button>
                        )}
                    </div>

                    <div className="relative flex items-start">
                        <textarea
                            name="content"
                            placeholder="Enter Note Content"
                            value={noteData.content}
                            onChange={handleChange}
                            className="p-3 pr-10 rounded-lg bg-zinc-700 text-white outline-none placeholder:text-zinc-400 h-32 w-full resize-none"
                        />
                        {recognition && (
                            <button
                                type="button"
                                onClick={() => startSpeechRecognition("noteContent")}
                                className={`absolute right-3 top-3 p-1 rounded-full hover:bg-zinc-600 transition duration-200 cursor-pointer ${
                                    isListening.noteContent ? "text-red-500 animate-pulse" : "text-zinc-400"
                                }`}
                                title="Speech to text"
                            >
                                🎤
                            </button>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 py-3 rounded-lg font-semibold transition duration-300 hover:scale-105"
                    >
                        {loading ? "Saving..." : editId ? "Update Note" : "Add Note"}
                    </button>
                </form>

                <div id="tasks" className="mt-10 bg-zinc-800 p-6 rounded-2xl">
                    <h2 className="text-3xl font-bold mb-6">
                        Tasks
                    </h2>

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative flex items-center">
                            <input
                                type="text"
                                placeholder="Enter Task"
                                value={taskTitle}
                                onChange={(e) => setTaskTitle(e.target.value)}
                                className="w-full p-3 pr-10 rounded-lg bg-zinc-700 outline-none"
                            />
                            {recognition && (
                                <button
                                    type="button"
                                    onClick={() => startSpeechRecognition("taskTitle")}
                                    className={`absolute right-3 p-1 rounded-full hover:bg-zinc-600 transition duration-200 cursor-pointer ${
                                        isListening.taskTitle ? "text-red-500 animate-pulse" : "text-zinc-400"
                                    }`}
                                    title="Speech to text"
                                >
                                    🎤
                                </button>
                            )}
                        </div>

                        <button
                            onClick={addTask}
                            className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg transition duration-300 hover:scale-105"
                        >
                            Add Task
                        </button>
                    </div>

                    <div className="mt-6 space-y-4">
                        {tasks.map((task) => (
                            <div
                                key={task._id}
                                className="bg-zinc-700 p-4 rounded-xl flex flex-col md:flex-row justify-between md:items-center gap-4"
                            >
                                <h3
                                    className={`text-lg ${task.completed ? "line-through text-zinc-400" : ""
                                        }`}
                                >
                                    {task.title}
                                </h3>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => toggleTask(task._id)}
                                        className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg"
                                    >
                                        {task.completed ? "Undo" : "Done"}
                                    </button>

                                    <button
                                        onClick={() => deleteTask(task._id)}
                                        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-10">
                    <h2 className="text-3xl font-bold mb-6">
                        Your Notes
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {notes.map((note) => (
                            <div
                                key={note._id}
                                className="bg-zinc-800 p-6 rounded-2xl"
                            >
                                <h3 className="text-2xl font-semibold">
                                    {note.title}
                                </h3>

                                <p className="text-zinc-400 mt-3">
                                    {note.content}
                                </p>

                                <button
                                    onClick={() => deleteNote(note._id)}
                                    className="mt-4 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition duration-300 hover:scale-105"
                                >
                                    Delete
                                </button>

                                <button
                                    onClick={() => editNote(note)}
                                    className="mt-4 ml-3 bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg transition duration-300 hover:scale-105"
                                >
                                    Edit
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                    <div className="bg-zinc-800 p-6 rounded-2xl">
                        <h2 className="text-2xl font-semibold">Notes</h2>
                        <p className="text-zinc-400 mt-2">
                            {notes.length} Notes Created
                        </p>
                    </div>

                    <div className="bg-zinc-800 p-6 rounded-2xl">
                        <h2 className="text-2xl font-semibold">Tasks</h2>
                        <p className="text-zinc-400 mt-2">
                            {tasks.length} Total Tasks
                        </p>
                    </div>

                    <div className="bg-zinc-800 p-6 rounded-2xl">
                        <h2 className="text-2xl font-semibold">Completed</h2>
                        <p className="text-zinc-400 mt-2">
                            {completedTasks} Tasks Completed
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
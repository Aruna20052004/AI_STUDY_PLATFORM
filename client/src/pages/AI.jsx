import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

function AI() {
    const navigate = useNavigate();
    const [question, setQuestion] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);
    const [isListening, setIsListening] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);
    const [zoomLevel, setZoomLevel] = useState(100);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editText, setEditText] = useState("");

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [chatHistory]);

    useEffect(() => {
        fetchChatHistory();
    }, []);

    const fetchChatHistory = async () => {
        try {
            const response = await fetch(`${API_URL}/api/ai/history`, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                }
            });
            if (response.ok) {
                const data = await response.json();
                const mapped = [];
                data.forEach(item => {
                    mapped.push({ type: "user", text: item.question });
                    mapped.push({ type: "ai", text: item.answer });
                });
                setChatHistory(mapped);
            }
        } catch (error) {
            console.error("Fetch chat history error:", error);
        }
    };

    const handleClearHistory = async () => {
        try {
            const response = await fetch(`${API_URL}/api/ai/history`, {
                method: "DELETE",
                headers: {
                    Authorization: localStorage.getItem("token"),
                }
            });
            if (response.ok) {
                setChatHistory([]);
            }
        } catch (error) {
            console.error("Clear chat history error:", error);
        }
    };

    const startSpeechRecognition = () => {
        if (!recognition) {
            alert("Speech Recognition is not supported in this browser.");
            return;
        }

        if (isListening) {
            recognition.stop();
            return;
        }

        try {
            recognition.stop();
        } catch (e) {}

        setIsListening(true);
        setQuestion("");

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setQuestion(transcript);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onerror = (event) => {
            console.error(event.error);
            setIsListening(false);
        };

        recognition.start();
    };

    const startEditing = (index, text) => {
        // Strip out attachment indicator if present for cleaner editing
        const cleanedText = text.replace(/\s\[Attached:.*\]$/, "");
        setEditingIndex(index);
        setEditText(cleanedText);
    };

    const handleCancelEdit = () => {
        setEditingIndex(null);
        setEditText("");
    };

    const handleSaveEdit = async (index) => {
        if (!editText.trim()) return;

        const newQuestion = editText;
        setEditingIndex(null);
        setEditText("");
        setLoading(true);

        const truncatedHistory = chatHistory.slice(0, index);
        setChatHistory([
            ...truncatedHistory,
            { type: "user", text: newQuestion },
            { type: "ai", text: "Thinking..." }
        ]);

        try {
            const formData = new FormData();
            formData.append("question", newQuestion);

            const response = await fetch(`${API_URL}/api/ai/ask`, {
                method: "POST",
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
                body: formData,
            });

            const data = await response.json();

            setChatHistory((prev) => [
                ...prev.slice(0, -1),
                {
                    type: "ai",
                    text: response.ok
                        ? data.answer
                        : data.message || "AI Error",
                },
            ]);
        } catch (error) {
            console.log(error);
            setChatHistory((prev) => [
                ...prev.slice(0, -1),
                {
                    type: "ai",
                    text: "AI service is temporarily unavailable. Please try again later.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleAskAI = async () => {
        if (!question.trim() && !selectedFile) return;

        const userQuestion = question || "Summarize this file";
        const fileToUpload = selectedFile;

        setLoading(true);
        setChatHistory((prev) => [
            ...prev,
            { 
                type: "user", 
                text: fileToUpload ? `${userQuestion} [Attached: ${fileToUpload.name}]` : userQuestion 
            },
            { type: "ai", text: "Thinking..." },
        ]);
        
        setQuestion("");
        setSelectedFile(null);

        try {
            const formData = new FormData();
            formData.append("question", userQuestion);
            if (fileToUpload) {
                formData.append("file", fileToUpload);
            }

            const response = await fetch(`${API_URL}/api/ai/ask`, {
                method: "POST",
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
                body: formData,
            });

            const data = await response.json();

            setChatHistory((prev) => [
                ...prev.slice(0, -1),
                {
                    type: "ai",
                    text: response.ok
                        ? data.answer
                        : data.message || "AI Error",
                },
            ]);
        } catch (error) {
            console.log(error);

            setChatHistory((prev) => [
                ...prev.slice(0, -1),
                {
                    type: "ai",
                    text: "AI service is temporarily unavailable. Please try again later.",
                },
            ]);
            setLoading(false);
        }
    };

    return (
        <div id="ai" className="min-h-screen md:h-screen bg-zinc-900 text-white p-4 md:p-8 flex flex-col md:overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 w-full">
                <h1 className="text-4xl font-bold">
                    AI Assistant 🤖
                </h1>
                <button
                    onClick={() => navigate("/dashboard")}
                    className="bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 px-4 py-2 rounded-xl transition duration-300 self-start sm:self-auto"
                >
                    ⬅ Back to Dashboard
                </button>
            </div>

            <div className="bg-zinc-800 p-6 rounded-2xl w-full flex-1 flex flex-col overflow-hidden">
                <div className="flex justify-between items-center mb-4 gap-4">
                    <button
                        onClick={handleClearHistory}
                        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold cursor-pointer"
                    >
                        New Chat
                    </button>

                    <div className="flex items-center gap-2 bg-zinc-700/50 border border-zinc-650 rounded-xl px-3 py-1.5">
                        <button
                            onClick={() => setZoomLevel(prev => Math.max(70, prev - 10))}
                            className="text-zinc-400 hover:text-white px-2 py-0.5 rounded hover:bg-zinc-600 cursor-pointer font-bold transition text-xs"
                            title="Zoom Out"
                        >
                            A-
                        </button>
                        <span className="text-xs text-zinc-300 font-semibold select-none w-10 text-center">{zoomLevel}%</span>
                        <button
                            onClick={() => setZoomLevel(prev => Math.min(180, prev + 10))}
                            className="text-zinc-400 hover:text-white px-2 py-0.5 rounded hover:bg-zinc-600 cursor-pointer font-bold transition text-xs"
                            title="Zoom In"
                        >
                            A+
                        </button>
                        <button
                            onClick={() => setZoomLevel(100)}
                            className="text-xs text-zinc-500 hover:text-zinc-300 ml-1 cursor-pointer hover:underline"
                        >
                            Reset
                        </button>
                    </div>
                </div>

                <div 
                    className="flex-1 space-y-4 overflow-y-auto pr-2 mb-4"
                    style={{ fontSize: `${zoomLevel}%` }}
                >
                    {chatHistory.map((chat, index) => (
                        <div
                            key={index}
                            className={`p-4 rounded-xl max-w-4xl relative group ${chat.type === "user"
                                ? "bg-blue-500 text-white ml-auto"
                                : "bg-zinc-700 text-zinc-300 mr-auto"
                                }`}
                        >
                            {editingIndex === index ? (
                                <div className="flex flex-col gap-2 min-w-[280px] md:min-w-[400px]">
                                    <textarea
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        className="w-full p-2.5 rounded bg-zinc-800 text-white outline-none border border-zinc-600 focus:border-blue-400 text-sm resize-none"
                                        rows={3}
                                    />
                                    <div className="flex justify-end gap-2 text-xs">
                                        <button
                                            onClick={handleCancelEdit}
                                            className="bg-zinc-600 hover:bg-zinc-500 px-3 py-1.5 rounded cursor-pointer transition font-medium"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => handleSaveEdit(index)}
                                            className="bg-blue-600 hover:bg-blue-755 px-3 py-1.5 rounded cursor-pointer transition font-semibold"
                                        >
                                            Save & Submit
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative">
                                    <div className="whitespace-pre-wrap leading-relaxed pr-6">
                                        {chat.text}
                                    </div>
                                    {chat.type === "user" && !loading && (
                                        <button
                                            onClick={() => startEditing(index, chat.text)}
                                            className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition duration-200 text-zinc-300 hover:text-white cursor-pointer text-xs p-0.5 rounded hover:bg-blue-600/30"
                                            title="Edit Message"
                                        >
                                            ✏️
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                    <div ref={chatEndRef}></div>
                </div>

                <div>
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            placeholder="Ask something..."
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleAskAI();
                                }
                            }}
                            className="w-full p-4 pr-24 rounded-lg bg-zinc-700 outline-none"
                        />
                        <div className="absolute right-4 flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current.click()}
                                className="p-1 rounded-full text-zinc-400 hover:bg-zinc-650 transition duration-200 cursor-pointer text-lg"
                                title="Attach document or image"
                            >
                                📎
                            </button>
                            {recognition && (
                                <button
                                    type="button"
                                    onClick={startSpeechRecognition}
                                    className={`p-1 rounded-full hover:bg-zinc-650 transition duration-200 cursor-pointer ${
                                        isListening ? "text-red-500 animate-pulse" : "text-zinc-400"
                                    }`}
                                    title="Speech to text"
                                >
                                    🎤
                                </button>
                            )}
                        </div>
                    </div>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,image/*"
                    />

                    {selectedFile && (
                        <div className="mt-2 text-sm text-zinc-400 bg-zinc-750/50 px-3 py-1.5 rounded-xl flex items-center justify-between w-fit gap-3 border border-zinc-700">
                            <span>📎 {selectedFile.name}</span>
                            <button
                                onClick={() => setSelectedFile(null)}
                                className="text-red-400 hover:text-red-500 font-bold ml-2 cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>
                    )}

                    <button
                        onClick={handleAskAI}
                        disabled={loading}
                        className="mt-4 bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg font-semibold disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? "Thinking..." : "Ask AI"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AI;
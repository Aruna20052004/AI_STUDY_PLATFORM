import { useState, useEffect, useRef } from "react";

function AI() {
    const [question, setQuestion] = useState("");
    const [chatHistory, setChatHistory] = useState(
        JSON.parse(localStorage.getItem("chatHistory")) || []
    );
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [chatHistory]);

    useEffect(() => {
        localStorage.setItem(
            "chatHistory",
            JSON.stringify(chatHistory)
        );
    }, [chatHistory]);

    const handleAskAI = async () => {
        if (!question.trim()) return;

        const userQuestion = question;
        setLoading(true);
        setChatHistory((prev) => [
            ...prev,
            { type: "user", text: userQuestion },
            { type: "ai", text: "Thinking..." },
        ]);
        setLoading(false);
        setQuestion("");

        try {
            const response = await fetch("https://ai-study-platform-q2ko.onrender.com/api/ai/ask", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("token"),
                },
                body: JSON.stringify({
                    question: userQuestion,
                }),
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
        <div id="ai" className="min-h-screen bg-zinc-900 text-white p-10">
            <h1 className="text-4xl font-bold mb-8">
                AI Assistant 🤖
            </h1>


            <div className="bg-zinc-800 p-6 rounded-2xl max-w-2xl">
                <button
                    onClick={() => {
                        setChatHistory([]);
                        localStorage.removeItem("chatHistory");
                    }}
                    className="mb-4 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold"
                >
                    New Chat
                </button>

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
                    className="w-full p-4 rounded-lg bg-zinc-700 outline-none"
                />

                <button
                    onClick={handleAskAI}
                    disabled={loading}
                    className="mt-4 bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
                >
                    {loading ? "Thinking..." : "Ask AI"}
                </button>

                <div className="mt-6 space-y-4 max-h-[500px] overflow-y-auto">
                    {chatHistory.map((chat, index) => (
                        <div
                            key={index}
                            className={`p-4 rounded-xl ${chat.type === "user"
                                ? "bg-blue-500 text-white text-right"
                                : "bg-zinc-700 text-zinc-300"
                                }`}
                        >
                            <div className="whitespace-pre-wrap leading-relaxed">
                                {chat.text}
                            </div>
                        </div>

                    ))}
                    <div ref={chatEndRef}></div>
                </div>
            </div>
        </div>
    );
}

export default AI;
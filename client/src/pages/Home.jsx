import { useEffect } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
function Home() {
    const navigate = useNavigate();
    useEffect(() => {

        fetch("http://localhost:5000")
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
                                .getElementById("features")
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

        </div>


    );
}

export default Home;
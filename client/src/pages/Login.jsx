import toast from "react-hot-toast";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
function Login() {

    const emailRef = useRef(null);

    const passwordRef = useRef(null);

    useEffect(() => {

        emailRef.current.focus();

    }, []);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();
    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await fetch("https://ai-study-platform-q2ko.onrender.com/api/users/login", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify(formData),

            });

            const data = await response.json();
            console.log(data);
            toast.success(data.message);

            if (response.ok) {

                localStorage.setItem("token", data.token);

                navigate("/dashboard");

            }


        } catch (error) {

            console.log(error);

        }

    };
    return (

        <div className="min-h-screen bg-zinc-900 flex items-center justify-center">

            <div className="bg-zinc-800 p-10 rounded-2xl w-[400px]">

                <h1 className="text-4xl text-white font-bold text-center mb-8">
                    Login
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-5"
                >

                    <input
                        type="email"
                        name="email"
                        placeholder="Enter Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="p-3 rounded-lg bg-zinc-700 text-white outline-none placeholder:text-zinc-400"
                        ref={emailRef}

                        onKeyDown={(e) => {

                            if (e.key === "Enter") {

                                e.preventDefault();

                                passwordRef.current.focus();

                            }

                        }}
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Enter Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="p-3 rounded-lg bg-zinc-700 text-white outline-none placeholder:text-zinc-400"
                        ref={passwordRef}
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition"
                    >
                        Login
                    </button>

                </form>

            </div>

        </div>

    );
}

export default Login;
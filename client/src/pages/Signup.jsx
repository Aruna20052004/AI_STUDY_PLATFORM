import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

function Signup() {
    const navigate = useNavigate();
    const emailRef = useRef(null);

    const passwordRef = useRef(null);
    useEffect(() => {

        emailRef.current.focus();

    }, []);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        role: "student",
    });

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        console.log("Form Submitted");

        try {

            const response = await fetch(`${API_URL}/api/users/signup`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify(formData),

            });

            const data = await response.json();

            console.log(data);

            toast.success(data.message);

            setTimeout(() => {

                navigate("/login");

            }, 1500);

        } catch (error) {

            console.log(error);

        }

    };
    return (

        <div className="min-h-screen bg-zinc-900 flex items-center justify-center">

            <div className="bg-zinc-800 p-10 rounded-2xl w-[400px]">

                <h1 className="text-4xl text-white font-bold text-center mb-8">
                    Signup
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-5"
                    autoComplete="off"
                >

                    <input
                        type="text"
                        name="username"
                        placeholder="Enter Username"
                        value={formData.username}
                        onChange={handleChange}
                        autoComplete="off"
                        className="p-3 rounded-lg bg-zinc-700 text-white outline-none placeholder:text-zinc-400"
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Enter Email"
                        value={formData.email}
                        onChange={handleChange}
                        autoComplete="off"
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
                        autoComplete="new-password"
                        className="p-3 rounded-lg bg-zinc-700 text-white outline-none placeholder:text-zinc-400"
                        ref={passwordRef}
                    />

                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="p-3 rounded-lg bg-zinc-700 text-white outline-none border border-zinc-650"
                    >
                        <option value="student">Student</option>
                        <option value="admin">Admin</option>
                    </select>

                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition"
                    >
                        Signup
                    </button>
                </form>

            </div>

        </div>

    );
}

export default Signup;
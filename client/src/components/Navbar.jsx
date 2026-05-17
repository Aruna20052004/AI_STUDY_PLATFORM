import { Link } from "react-router-dom";
function Navbar() {
    return (
        <nav className="bg-zinc-950 text-white flex justify-between items-center px-8 py-4 border-b border-zinc-800">

            <h1 className="text-2xl font-bold text-blue-500">
                AI Study
            </h1>

            <ul className="flex gap-6 text-lg">

                <Link to="/">
                    <li className="hover:text-blue-400 cursor-pointer">
                        Home
                    </li>
                </Link>

                <Link to="/login">
                    <li className="hover:text-blue-400 cursor-pointer">
                        Login
                    </li>
                </Link>

                <Link to="/signup">
                    <li className="hover:text-blue-400 cursor-pointer">
                        Signup
                    </li>
                </Link>

            </ul>

        </nav>
    );
}

export default Navbar;
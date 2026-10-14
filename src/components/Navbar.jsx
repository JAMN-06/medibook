import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import "./Navbar.css";

function Navbar() {
    const { isDark, toggleTheme } = useTheme();

    return (
        <header className="navbar">
            <Link to="/" className="navbar-brand">
                MediBook
            </Link>
            <nav className="navbar-links">
                <Link to="/">Find a Doctor</Link>
                <Link to="/appointments">My Appointments</Link>
                <button onClick={toggleTheme} className="theme-toggle-btn">
                    {isDark ? "☀️ Light" : "🌙 Dark"}
                </button>
            </nav>
        </header>
    );
}

export default Navbar;
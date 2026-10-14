import { useTheme } from "../context/ThemeContext";

function ThemeToggle() {
    const { isDark, toggleTheme } = useTheme();

    return (
        <button onClick={toggleTheme} className="theme-toggle">
            {isDark ? "Light" : "Dark"}
        </button>
    );
}

export default ThemeToggle;
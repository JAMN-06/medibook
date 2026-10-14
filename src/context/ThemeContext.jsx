import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem("medibook-theme");
        return saved ? JSON.parse(saved) : false;
    });

    useEffect(() => {
        localStorage.setItem("medibook-theme", JSON.stringify(isDark));
        if (isDark) {
            document.documentElement.setAttribute("data-theme", "dark");
        } else {
            document.documentElement.removeAttribute("data-theme");
        }
    }, [isDark]);

    const toggleTheme = () => setIsDark((prev) => !prev);

    const value = {
        isDark,
        toggleTheme,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
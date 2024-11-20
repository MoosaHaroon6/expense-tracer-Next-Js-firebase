'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const ThemeContext = createContext({
    theme: "night",
    toggleTheme: () => { }
});

export function ThemeContextProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<string>('night');

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, [theme])

    const toggleTheme = () => {
        const newTheme = theme === "night" ? "light" : "night";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useThemeContext = () => useContext(ThemeContext);
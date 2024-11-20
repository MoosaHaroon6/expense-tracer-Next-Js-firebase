import { useThemeContext } from "@/context/themeContext";

const ThemeToggle = () => {
    const { toggleTheme } = useThemeContext();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 bg-gray-700 text-white rounded"
        >
            Toggle Theme
        </button>
    );
};

export default ThemeToggle;

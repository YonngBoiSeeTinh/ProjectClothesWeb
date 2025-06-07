import { useEffect, useState } from "react";
import "./DarkModeBtn.css";

const DarkModeBtn = () => {
    const [currentTheme, setCurrentTheme] = useState(
        localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
    );

    const element = document.documentElement; //Access the root element

    // Set the theme to localStorage and root element
    useEffect(() => {
        localStorage.setItem("theme", currentTheme);
        if (currentTheme === "dark") {
            element.classList.add("dark");
            element.classList.add("dark");
        } else {
            element.classList.remove("light");
            element.classList.remove("dark");
        }
    }, [currentTheme, element.classList]);

    return (
        <div className="relative">
            <label
                className="relative inline-flex items-center cursor-pointer translate-y-1"
                style={{ scale: "70%" }}
            >
                <input
                    className={`sr-only peer ${currentTheme === "dark" ? "opacity-0" : "opacity-100"} transition-all duration-300`}
                    value=""
                    type="checkbox"
                    onClick={() => setCurrentTheme(currentTheme === "dark" ? "light" : "dark")}
                />
                <div className="w-24 h-12 rounded-full ring-0 peer duration-500 outline-none bg-gray-200 overflow-hidden before:flex before:items-center before:justify-center after:flex after:items-center after:justify-center before:content-['☀️'] before:absolute before:h-10 before:w-10 before:top-1/2 before:bg-white before:rounded-full before:left-1 before:-translate-y-1/2 before:transition-all before:duration-700 peer-checked:before:opacity-0 peer-checked:before:rotate-90 peer-checked:before:-translate-y-full hover:shadow-lg hover:shadow-gray-400 peer-checked:shadow-lg peer-checked:shadow-gray-700 peer-checked:bg-[#383838] after:content-['🌑'] after:absolute after:bg-[#1d1d1d] after:rounded-full after:top-[4px] after:right-1 after:translate-y-full after:w-10 after:h-10 after:opacity-0 after:transition-all after:duration-700 peer-checked:after:opacity-100 peer-checked:after:rotate-180 peer-checked:after:translate-y-0"></div>
            </label>
        </div>
    );
};

export default DarkModeBtn;

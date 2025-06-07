/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "#f42c37",
                secondary: "#fff6a9",
                brandYellow: "#ff6900",
                brandBlue: "#1376f4",
                brandSony: 'rgba(0,0,128,1)',
                brandGreen: "#1d9e63",
                brandWhite: "#eeeeee",
            },
            container: {
                center: true,
                padding: {
                    default: "1rem",
                    sm: "3rem",
                },
            },
        },
        screens: {
            'sm': '640px',
            'md': '768px',
            'lg': '1024px',
            'xl': '1280px',
            '2xl': '1536px',
        }
    },
    plugins: [],
};

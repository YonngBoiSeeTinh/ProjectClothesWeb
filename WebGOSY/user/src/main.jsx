import { ConfigProvider } from "antd";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { App as AntdApp } from "antd";
import store from "./redux/store.js"; 
import App from "./App.jsx";
import "./index.css";

/* ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣠⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⣄⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣤⣶⣾⣿⣿⡿⠟⠛⠛⠛⠛⠛⠻⠿⣿⣿⣿⣿⣿⣷⣶⣤⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⣶⣿⣿⣿⣿⠟⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⢿⣿⣿⣿⣿⣿⣿⣶⣤⣄⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⣠⣶⣿⣿⣿⣿⣿⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⣿⣿⣿⣿⣿⣿⣿⣿⣷⡄⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⣼⡿⣿⣿⣿⣿⣿⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣆⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢻⣿⡟⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⣿⣿⣿⣿⣿⣿⣿⣿⡟⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠘⢿⣼⡟⢻⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⠳⠆⠀⠀⠀⠹⣿⣿⣿⣿⣿⣿⡟⠁⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢈⣻⣷⣾⣿⡇⠀⠀⠀⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⣀⠀⠀⠀⢻⣿⣿⣿⡿⢋⡀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⣿⠉⠙⢿⣿⡇⠀⠀⠀⠈⢻⣿⣷⣶⣄⣠⠀⠀⠀⣀⣠⣾⣿⣿⡯⠉⠁⠀⠀⠀⢻⣿⣿⡿⠛⢿⡆⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⣟⠀⠘⢾⡿⠀⠀⠀⢀⣠⣤⣶⣿⣿⣿⠟⠀⠀⣿⣿⣿⣿⣿⣷⣦⣄⡀⠀⠀⠀⢸⣿⣯⠀⣶⡆⣿⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⣿⠈⠀⣼⠃⠀⠀⠘⠋⠁⣈⣹⣿⣿⠏⠀⠀⠀⣿⣿⣏⠀⣈⣁⣈⡝⠻⠿⡆⠀⠰⣿⣏⠈⣿⢷⡟⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⣿⠀⠰⡇⠀⠀⠀⠀⠀⠀⠁⠀⠀⠀⠀⠀⠀⠀⢸⣽⣿⣆⠀⠀⠀⠀⠀⠀⠁⠀⢸⣿⣿⡆⣏⣿⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⣿⠀⠀⢱⡀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠀⠀⠀⠀⠀⠀⢿⣿⡄⠀⠀⠀⠀⠀⠀⠀⢸⣿⡟⣿⣿⡇⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠙⣄⠀⠀⣸⡄⠀⠀⠀⠀⠀⢀⡞⠁⣤⣤⣀⣠⣤⣀⣄⣸⣿⣦⡀⠀⠀⠀⠀⠀⢸⣿⣄⠟⣼⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⠷⠶⠻⡇⠀⠀⠀⠀⠀⠟⠀⠀⠀⠀⠉⠙⠿⠿⣿⠉⢀⡿⣷⡀⢸⣇⢰⠀⠸⣿⣡⡾⠃⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⡇⠀⠀⠀⠀⠀⣀⠀⠀⠀⠀⠐⠛⠀⠀⠁⠀⠀⢰⡟⢷⢸⣿⢀⠀⠀⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⡇⠀⠀⠀⠀⣼⡿⠓⠶⠒⠛⠛⠉⠙⠛⠻⠻⠿⣿⡇⠀⢸⡟⠀⠀⣠⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢘⡇⠒⠀⠀⠀⠈⠀⠀⠀⠀⠀⣶⠶⠶⠶⠶⠀⢀⣿⠁⢠⡾⠁⠀⣰⣿⠉⢇⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢈⡷⠶⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠁⠀⠿⠃⢀⣴⡟⢹⡄⠘⣧⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⠞⢁⡆⠀⠐⢢⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠀⠒⠀⠀⣠⣴⣿⡟⣰⡿⣡⡄⠈⢣⡀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⣀⣠⡤⠖⠒⠋⠁⠀⠘⣷⠀⠀⠀⠙⠦⣄⣀⣀⣀⣀⣀⣤⣶⣿⣦⣤⣴⣶⣿⡿⢋⣼⠟⢁⣿⠁⣠⣤⡉⠀⠀⠀⠀⠀⠀
⣠⠤⠔⠒⠚⠉⠁⠀⠀⠀⠀⠀⠀⠀⢹⡆⠀⠀⠀⠀⠉⠻⣿⣿⣿⣯⣥⣤⣤⣶⣿⣿⡿⠋⣠⡿⠁⠀⠀⠁⠲⢈⣿⣿⣷⣤⣄⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢦⡀⠤⡄⠀⠀⠀⠀⠉⡻⢿⣧⣿⣿⡟⢋⣤⡾⠋⠀⠀⠀⠀⠘⠛⢺⣿⣿⣿⣿⣿⣷⣤⣤
⡀⠀⣀⣀⣀⣀⣀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢦⣈⣳⣦⣤⣤⣿⣿⣿⠟⢋⣡⣶⣿⠋⢀⠀⠀⠀⡀⠀⠀⢀⡌⠘⣿⣿⣿⣿⣿⣿⣿ */

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <AntdApp
            theme={{
                components: {
                    Badge: {
                        textFontSize: 11,
                    },
                    Drawer: {
                        footerPaddingBlock: 28,
                        footerPaddingInline: 40,
                    },
                    Checkbox: {
                        colorPrimary: "#f42c37",
                        colorPrimaryHover: "#f42c37",
                    },
                    Button: {
                        defaultHoverColor: "#f42c37",
                        defaultHoverBorderColor: "#f42c37",
                        defaultHoverBg: "#f42c37",
                    },
                    Input: {
                        activeBorderColor: "#f42c37",
                        hoverBorderColor: "#f42c37",
                    },
                    Select: {
                        activeBorderColor: "#f42c37",
                        hoverBorderColor: "#f42c37",
                        optionSelectedBg: "#f42c37",
                        optionSelectedColor: "#fff",
                    },
                    Breadcrumb: {
                        linkHoverColor: "#f42c37",
                    },
                },
                token: {},
            }}
        >
            <BrowserRouter>
                <Provider store={store}>
                    <App />
                </Provider>
            </BrowserRouter>
        </AntdApp>
    </StrictMode>
);

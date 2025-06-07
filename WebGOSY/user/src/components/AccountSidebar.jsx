import { Link, useLocation } from "react-router-dom";
import PathNames from "../PathNames.js";

const Sidebar = () => {
    const location = useLocation(); // Get the current location

    const handleLogout = () => {
        localStorage.removeItem("userEmail"); // Clear the user email
        localStorage.removeItem("userId"); // Clear the user id if stored
        localStorage.removeItem("accountName");
    };

    return (
        <div className="flex flex-col h-[650px] w-64 bg-gray-100 p-5 shadow-lg select-none">
            {/* Add select-none class */}
            <h2 className="text-lg font-bold mb-4">Menu</h2>
            <ul className="flex-grow">
                <li
                    className={`mb-3 p-2 rounded-lg transition-colors duration-300 ${
                        location.pathname === PathNames.PROFILE
                            ? "bg-blue-200 font-bold text-blue-700"
                            : "hover:bg-blue-100"
                    }`}
                >
                    <Link to={PathNames.PROFILE}>Thông tin tài khoản</Link>
                </li>
                <li
                    className={`mb-3 p-2 rounded-lg transition-colors duration-300 ${
                        location.pathname === PathNames.MY_ORDERS
                            ? "bg-blue-200 font-bold text-blue-700"
                            : "hover:bg-blue-100"
                    }`}
                >
                    <Link to={PathNames.MY_ORDERS}>Lịch sử giao dịch</Link>
                </li>
            </ul>
            <button
                onClick={handleLogout}
                className="mt-auto bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition duration-300"
            >
                Đăng Xuất
            </button>
        </div>
    );
};

export default Sidebar;

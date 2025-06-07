import { useEffect, useState } from "react";
import { MenuOutlined, UserOutlined } from "@ant-design/icons";
import { Dropdown, Space, Modal, Avatar, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import PathNames from "../PathNames";
import { API_URL } from "../config";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, setUser } from "../redux/userSlide";
const UserMenu = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
    const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);

    useEffect(() => {
        if (user.isLoggedIn) {
            message.success("Welcome back!");
        }
    }, [user.isLoggedIn]);

    const handleLogout = () => {
        localStorage.removeItem("userId");
        dispatch(logoutUser());

        message.success("Logged out successfully");
        navigate(PathNames.HOMEPAGE);
    };

    const GuestItems = [
        {
            label: (
                <span onClick={() => setIsRegisterModalVisible(true)}>
                    Sign Up
                </span>
            ),
            key: "0",
        },
        {
            label: (
                <span onClick={() => setIsLoginModalVisible(true)}>Log In</span>
            ),
            key: "1",
        },
    ];

    const UserItems = [
        {
            label: <Link to={PathNames.PROFILE}>Profile</Link>,
            key: "0",
        },
        {
            label: <Link to={PathNames.MY_ORDERS}>My Orders</Link>,
            key: "1",
        },
        {
            label: <p onClick={handleLogout}>Log Out</p>,
            key: "2",
        },
    ];

    const handleMenuChange = (isOpen) => {
        setIsMenuOpen(isOpen);
    };

    return (
        <>
            {!user.isLoggedIn ? (
                <Dropdown
                    menu={{ items: GuestItems }}
                    trigger={["click"]}
                    onOpenChange={handleMenuChange}
                    className="inline-flex h-[2.8rem] w-[5.05rem] justify-center gap-[0.8rem] border-[1px] border-[#dddddd] rounded-[30px] p-2 m-[2rem] ml-[0.75rem] cursor-pointer transition-shadow duration-150 ease-linear hover:shadow-[0_2px_4px_rgba(0,0,0,0.18)] focus:shadow-[0_2px_4px_rgba(0,0,0,0.18)]"
                >
                    <Space>
                        <MenuOutlined
                            className={`transition-transform duration-200 ease-linear transform ${
                                isMenuOpen ? `rotate-90` : `rotate-0`
                            }`}
                        />
                        <UserOutlined />
                    </Space>
                </Dropdown>
            ) : (
                <Dropdown
                    menu={{ items: UserItems }}
                    trigger={["click"]}
                    onOpenChange={handleMenuChange}
                    className="inline-flex h-[2.8rem] w-[5.05rem] justify-center gap-[0.8rem] border-[1px] border-[#dddddd] rounded-[30px] p-2 m-[2rem] ml-[0.75rem] cursor-pointer transition-shadow duration-150 ease-linear hover:shadow-[0_2px_4px_rgba(0,0,0,0.18)] focus:shadow-[0_2px_4px_rgba(0,0,0,0.18)]"
                >
                    <Space>
                        <MenuOutlined
                            className={`transition-transform duration-200 ease-linear transform ${
                                isMenuOpen ? `rotate-90` : `rotate-0`
                            }`}
                        />
                        {user.image ? (
                           <Avatar src={`data:image/jpeg;base64,${user.image}`} />
                        ) : (
                            <UserOutlined />
                        )}
                    </Space>
                </Dropdown>
            )}

            {/* Modal for Login */}
            <Modal
                title="Log In"
                open={isLoginModalVisible}
                onCancel={() => setIsLoginModalVisible(false)}
                footer={null}
                width={450}
            >
                <Login
                    onSwitchToRegister={() => {
                        setIsLoginModalVisible(false);
                        setIsRegisterModalVisible(true);
                    }}
                    onSuccess={(userData) => {
                        dispatch(setUser(userData));
                        setIsLoginModalVisible(false);
                    }}
                />
            </Modal>

            {/* Modal for Register */}
            <Modal
                title="Sign Up"
                open={isRegisterModalVisible}
                onCancel={() => setIsRegisterModalVisible(false)}
                footer={null}
            >
                <Register
                    onRegisterSuccess={() => {
                        setIsRegisterModalVisible(false);
                        setIsLoginModalVisible(true);
                    }}
                />
            </Modal>
        </>
    );
};

export default UserMenu;

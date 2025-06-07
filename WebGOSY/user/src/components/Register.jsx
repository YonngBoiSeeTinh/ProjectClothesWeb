import { useState } from "react";
import axios from "axios";
import { Form, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { API_URL } from "../config.js";
import { useNavigate } from "react-router-dom";
import { message, Modal } from "antd";


const Register = ({ onRegisterSuccess }) => {
    const [name, setName] = useState("");
    const [accountName, setAccountName] = useState("");
    const [gender, setGender] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setphone] = useState("");
    const [dayOfBirth, setDayOfBirth] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [userAvatar, setUserAvatar] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false); // Modal state

    const [nameError, setNameError] = useState("");
    const [accountNameError, setAccountNameError] = useState("");
    const [genderError, setGenderError] = useState("");
    const [addressError, setAddressError] = useState("");
    const [phoneError, setphoneError] = useState("");
    const [dayOfBirthError, setDayOfBirthError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        console.log("register");
        e.preventDefault();
        setNameError("");
        setAccountNameError("");
        setAddressError("");
        setphoneError("");
        setEmailError("");
        setPasswordError("");
        setConfirmPasswordError("");
    
    
        let isValid = true;
    
        // Validation logic
        if (!name.trim()) {
            setNameError("Họ tên không được để trống.");
            isValid = false;
        }
       
        if (!address.trim()) {
            setAddressError("Địa chỉ không được để trống.");
            isValid = false;
        }
        const phonePattern = /^[0-9]{10,11}$/;
        if (!phonePattern.test(phone)) {
            setphoneError("Số điện thoại không hợp lệ (10-11 số).");
            isValid = false;
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setEmailError("Email không hợp lệ.");
            isValid = false;
        }
        if (password.length < 6) {
            setPasswordError("Mật khẩu phải có ít nhất 6 ký tự.");
            isValid = false;
        }
        if (password !== confirmPassword) {
            setConfirmPasswordError("Mật khẩu không khớp.");
            isValid = false;
        }
    
        if (isValid) {
            try {
                const formData = new FormData();
                formData.append("name", name);
                formData.append("address", address);
                formData.append("phone", phone);
                formData.append("role", 4);
                formData.append("totalBuy", 0);
                formData.append("account", 0);
                if (userAvatar) {
                    formData.append("image", userAvatar);
                }
    
                // Gửi yêu cầu tạo user
                const response = await fetch(`${API_URL}/api/Users`, {
                    method: "POST",
                    body: formData,
                });
             
                const data = await response.json()
                console.log("response json", data);
                if(response.status == 201){
                    // Sau khi tạo user thành công, tạo account
                const userId = data?.id; 
                console.log('userId', userId);
                await handelCreateAccount(userId);
               
                }
                
    
                onRegisterSuccess();
            } catch (error) {
                console.error(
                    "Error during registration:",
                    error.response?.data || error.message
                );
                setEmailError( "email đã tồn tại");
                message.open({
                    type: "error",
                    content:
                        "Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại.",
                    duration: 4,
                });
            }
        }
    };
    
    const handelCreateAccount = async (userId) => {
        const account = {
            email: email,
            password: password,
            userId: userId
        };
    
        try {
            await axios.post(`${API_URL}/api/Accounts`, account, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
    
            console.log("Account created successfully.");
            message.success("Đăng ký thành công!", 4);
            onRegisterSuccess();
        } catch (error) {
            console.error("Error creating account:", error.response?.data || error.message);
    
            // Nếu tạo account thất bại, gọi API xóa user
            try {
                await axios.delete(`${API_URL}/api/Users/${userId}`);
                console.log("User deleted due to account creation failure.");
            } catch (deleteError) {
                console.error("Failed to delete user:", deleteError.response?.data || deleteError.message);
            }
    
            message.error("Đăng ký thất bại, vui lòng thử lại.", 4);
        }
    };
    
    
    // Modal handling functions
    const handleOk = () => {
        // setIsModalVisible(false);
        // navigate("/");
    };
    
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className=" p-8 rounded-lg max-w-md w-full text-center">
                {/* <h2 className="text-3xl font-bold mb-6 text-gray-800">
                    Đăng ký
                </h2> */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-left">Họ tên</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nhập họ tên"
                            className="border rounded-md p-2 w-full"
                        />
                        {nameError && (
                            <p className="text-red-500">{nameError}</p>
                        )}
                    </div>
                    
                    
                    <div>
                        <label className="block text-left">Địa chỉ</label>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Nhập địa chỉ"
                            className="border rounded-md p-2 w-full"
                        />
                        {addressError && (
                            <p className="text-red-500">{addressError}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-left">Số điện thoại</label>
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setphone(e.target.value)}
                            placeholder="Nhập số điện thoại"
                            className="border rounded-md p-2 w-full"
                        />
                        {phoneError && (
                            <p className="text-red-500">{phoneError}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-left">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Nhập email"
                            className="border rounded-md p-2 w-full"
                        />
                        {emailError && (
                            <p className="text-red-500">{emailError}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-left">Mật khẩu</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Nhập mật khẩu"
                            className="border rounded-md p-2 w-full"
                        />
                        {passwordError && (
                            <p className="text-red-500">{passwordError}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-left">
                            Nhập lại mật khẩu
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Nhập lại mật khẩu"
                            className="border rounded-md p-2 w-full"
                        />
                        {confirmPasswordError && (
                            <p className="text-red-500">
                                {confirmPasswordError}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-left">Avatar</label>
                        <input
                            type="file"
                            onChange={(e) => setUserAvatar(e.target.files[0])}
                            className="border rounded-md p-2 w-full"
                        />
                    </div>
                    

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white rounded-md p-2 hover:bg-blue-700 transition duration-300"
                    >
                        Đăng ký
                    </button>
                </form>
            </div>

            {/* Verification Modal */}
            <Modal
                title="Xác thực tài khoản"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <button
                        key="submit"
                        className="bg-blue-600 text-white rounded-md p-2 hover:bg-blue-700 transition duration-300"
                        onClick={handleOk}
                    >
                        Đã xác thực
                    </button>,
                ]}
            >
                <p>
                    Vui lòng xác thực tài khoản của bạn bằng cách nhấp vào liên
                    kết đã gửi đến email của bạn.
                </p>
            </Modal>
        </div>
    );
};

export default Register;

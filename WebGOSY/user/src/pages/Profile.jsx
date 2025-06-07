import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AccountSidebar from "../components/AccountSidebar.jsx";
import { API_URL } from "../config.js";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, setUser } from "../redux/userSlide";
const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [userAvatar, setUserAvatar] = useState(); // State for user avatar upload
    const [avatarPreview, setAvatarPreview] = useState(null); // State for avatar preview
    const [avatarError, setAvatarError] = useState(""); // State for avatar error
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });
    const [passwordError, setPasswordError] = useState("");
    const [passwordSuccess, setPasswordSuccess] = useState("");
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState("");
    const [updateError, setUpdateError] = useState("");

    // Thêm các hàm validate
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateAge = (birthDate) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();

        if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birth.getDate())
        ) {
            age--;
        }
        return age >= 18;
    };

    const validatephone = (phone) => {
        const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
        return phoneRegex.test(phone);
    };

    const validateName = (name) => {
        return name.trim().length >= 2;
    };

    const validatePassword = (password) => {
        // Sửa regex để chấp nhận ký tự đặc biệt
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };

    // Thêm state cho validation errors
    const [validationErrors, setValidationErrors] = useState({
        name: "",
        email: "",
        phone: "",
        dayOfBirth: "",
        password: "",
    });

    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
   
    useEffect(() => {
        setUserData(user)
    }, [user, dispatch]);
    console.log(user.image);
    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        if (!isEditing) {
            setUserAvatar(null); // Reset userAvatar when editing is toggled off
            setAvatarPreview(null); // Reset avatar preview when editing is toggled off
            setAvatarError(""); // Reset avatar error when editing is toggled off
        }
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleUpdateUserData = async (e) => {
        e.preventDefault();

        // Reset messages
        setSuccessMessage("");
        setUpdateError("");
        setValidationErrors({
            name: "",
            email: "",
            phone: "",
            dayOfBirth: "",
            password: "",
        });

        // Validate all fields
        let hasErrors = false;
        const newErrors = {};

        if (!validateName(userData.name)) {
            newErrors.name = "Tên phải có ít nhất 2 ký tự";
            hasErrors = true;
        }

        if (!validateEmail(userData.email)) {
            newErrors.email = "Email không hợp lệ";
            hasErrors = true;
        }

        if (!validatephone(userData.phone)) {
            newErrors.phone = "Số điện thoại không hợp lệ";
            hasErrors = true;
        }

        // if (!validateAge(userData.dayOfBirth)) {
        //     newErrors.dayOfBirth = "Bạn phải đủ 18 tuổi";
        //     hasErrors = true;
        // }

        // Validate password if changing
        if (passwordData.newPassword) {
            if (!validatePassword(passwordData.newPassword)) {
                newErrors.password =
                    "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số";
                hasErrors = true;
            }
            if (passwordData.newPassword !== passwordData.confirmNewPassword) {
                newErrors.password = "Mật khẩu mới không khớp";
                hasErrors = true;
            }
        }

        if (hasErrors) {
            setValidationErrors(newErrors);
            setUpdateError("Vui lòng kiểm tra lại thông tin");
            return;
        }

        const userId = localStorage.getItem("userId");

        const formData = new FormData(); // Create FormData to handle file uploads
        formData.append("name", userData.name);
        //formData.append("email", userData.email);
        formData.append("phone", userData.phone);
        //formData.append("dayOfBirth", userData.dayOfBirth);
        //formData.append("gender", userData.gender);
        formData.append("address", userData.address);
        formData.append("account", user.account);
        formData.append("totalBuy", user.totalBuy);
        formData.append("role", user.role);
        formData.append("createdAt", userData.createdAt);
        
        if (userAvatar) {
            formData.append("image", userAvatar); // Append the avatar file
        }
        console.log([...formData]); // Log FormData entries


        // if (passwordData.newPassword) {
        //     if (passwordData.newPassword !== passwordData.confirmNewPassword) {
        //         setPasswordError("Mật khẩu mới không khớp");
        //         return;
        //     }
        //     formData.append("currentPassword", passwordData.currentPassword);
        //     formData.append("newPassword", passwordData.newPassword);
        // }

        try {
            const response = await fetch(`${API_URL}/api/Users/${userId}`, {
                method: "PUT",
                body: formData,
            });

           
            console.log('data update user:', response);
            if (response.ok) {
              
                const updatedUser = {
                    ...userData,
                    image:  user.image, 
                };
                dispatch(setUser(updatedUser)); 
                console.log('setUser ', updatedUser);
                setIsEditing(false);
                setUserAvatar(null); // Reset userAvatar after successful update
                setAvatarPreview(null); // Reset avatar preview after successful update
                if (passwordData.newPassword) {
                    setPasswordSuccess("Mật khẩu đã được cập nhật thành công");
                }
                setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmNewPassword: "",
                });
                setPasswordError("");
                // Hiển thị thông báo thành công
                setSuccessMessage("Cập nhật thông tin thành công!");

                // Tự động ẩn thông báo sau 3 giây
                setTimeout(() => {
                    setSuccessMessage("");
                }, 3000);
            } else {
                setUpdateError(
                    "Lỗi cập nhật thông tin người dùng"
                );
            }
        } catch (error) {
            setUpdateError("Lỗi kết nối server");
            console.log(error);
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2000000) {
                // Limit to 2MB
                setAvatarError("File size exceeds 2MB limit");
                return;
            }
            setUserAvatar(file);
            setAvatarPreview(URL.createObjectURL(file)); // Create a preview URL for the selected file
            setAvatarError(""); // Clear any previous error
        }
    };

    return (
        <div className="flex flex-col md:flex-row min-h-[690px] bg-gray-100 p-5 relative">
            <AccountSidebar />
            <div className="flex-1 ml-0 md:ml-10">
                {/* Thêm thông báo thành công */}
                {successMessage && (
                    <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg flex items-center justify-between">
                        <div className="flex items-center">
                            <i className="fas fa-check-circle mr-2"></i>
                            {successMessage}
                        </div>
                        <button
                            onClick={() => setSuccessMessage("")}
                            className="text-green-700 hover:text-green-900"
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                )}

                {/* Thêm thông báo lỗi */}
                {updateError && (
                    <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex items-center justify-between">
                        <div className="flex items-center">
                            <i className="fas fa-exclamation-circle mr-2"></i>
                            {updateError}
                        </div>
                        <button
                            onClick={() => setUpdateError("")}
                            className="text-red-700 hover:text-red-900"
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                )}

                <div className="bg-white p-6 rounded-lg shadow-lg mb-5">
                    <h1 className="text-3xl font-bold mb-6">
                        Thông tin tài khoản
                    </h1>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    {userData ? (
                        <div className="bg-white rounded-lg">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="font-medium">
                                        Avatar:
                                    </label>
                                    <div className="flex items-center space-x-4">
                                        {isEditing ? (
                                            <>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={
                                                        handleAvatarChange
                                                    } // Update avatar and preview
                                                    className="border rounded-lg p-2"
                                                />
                                                {avatarPreview ? (
                                                    <img
                                                        src={avatarPreview}
                                                        alt="Avatar Preview"
                                                        className="w-16 h-16 rounded-full object-cover" // object-cover to maintain aspect ratio
                                                    />
                                                ) : <img
                                                src={ `data:image/jpeg;base64,${user?.image}`}
                                                alt="Avatar Preview"
                                                className="w-16 h-16 rounded-full object-cover" // object-cover to maintain aspect ratio
                                            /> }
                                            </>
                                        ) : (
                                            <img
                                                src={
                                                     `data:image/jpeg;base64,${user?.image}`
                                                }
                                                alt="User Avatar"
                                                className="w-16 h-16 rounded-full object-cover"
                                            />
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-between items-start">
                                    <label className="font-medium">Tên:</label>
                                    <div className="w-1/2 text-right">
                                        {" "}
                                        {/* Thêm text-right */}
                                        {isEditing ? (
                                            <>
                                                <input
                                                    type="text"
                                                    className={`border rounded-lg p-2 w-full text-left ${
                                                        /* Giữ text-left cho input */
                                                        validationErrors.name
                                                            ? "border-red-500"
                                                            : ""
                                                    }`}
                                                    name="name"
                                                    value={userData.name}
                                                    onChange={(e) =>
                                                        setUserData({
                                                            ...userData,
                                                            name: e.target
                                                                .value,
                                                        })
                                                    }
                                                    placeholder="Tên"
                                                    required
                                                />
                                                {validationErrors.name && (
                                                    <p className="text-red-500 text-sm absolute right-0 mt-1">
                                                        {validationErrors.name}
                                                    </p>
                                                )}
                                            </>
                                        ) : (
                                            <p>{userData.name}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-between items-start">
                                    <label className="font-medium">
                                        Email:
                                    </label>
                                    <div className="w-1/2 text-right">
                                        {isEditing ? (
                                            <>
                                                <input
                                                    type="email"
                                                    className={`border rounded-lg p-2 w-full text-left ${
                                                        validationErrors.email
                                                            ? "border-red-500"
                                                            : ""
                                                    }`}
                                                    name="email"
                                                    value={userData.email}
                                                    onChange={(e) =>
                                                        setUserData({
                                                            ...userData,
                                                            email: e.target
                                                                .value,
                                                        })
                                                    }
                                                    placeholder="Email"
                                                    required
                                                />
                                                {validationErrors.email && (
                                                    <p className="text-red-500 text-sm absolute right-0 mt-1">
                                                        {validationErrors.email}
                                                    </p>
                                                )}
                                            </>
                                        ) : (
                                            <p>{userData.email}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-between items-start">
                                    <label className="font-medium">
                                        Số điện thoại:
                                    </label>
                                    <div className="w-1/2 text-right">
                                        {isEditing ? (
                                            <>
                                                <input
                                                    type="text"
                                                    className={`border rounded-lg p-2 w-full text-left ${
                                                        validationErrors.phone
                                                            ? "border-red-500"
                                                            : ""
                                                    }`}
                                                    name="phone"
                                                    value={userData.phone}
                                                    onChange={(e) =>
                                                        setUserData({
                                                            ...userData,
                                                            phone:
                                                                e.target.value,
                                                        })
                                                    }
                                                    placeholder="Số điện thoại"
                                                    required
                                                />
                                                {validationErrors.phone && (
                                                    <p className="text-red-500 text-sm absolute right-0 mt-1">
                                                        {
                                                            validationErrors.phone
                                                        }
                                                    </p>
                                                )}
                                            </>
                                        ) : (
                                            <p>{userData.phone}</p>
                                        )}
                                    </div>
                                </div>

                                {/* <div className="flex justify-between items-start">
                                    <label className="font-medium">
                                        Ngày sinh:
                                    </label>
                                    <div className="w-1/2 text-right">
                                        {isEditing ? (
                                            <>
                                                <input
                                                    type="date"
                                                    className={`border rounded-lg p-2 w-full text-left ${
                                                        validationErrors.dayOfBirth
                                                            ? "border-red-500"
                                                            : ""
                                                    }`}
                                                    name="dayOfBirth"
                                                    value={userData.dayOfBirth}
                                                    onChange={(e) =>
                                                        setUserData({
                                                            ...userData,
                                                            dayOfBirth:
                                                                e.target.value,
                                                        })
                                                    }
                                                    required
                                                />
                                                {validationErrors.dayOfBirth && (
                                                    <p className="text-red-500 text-sm absolute right-0 mt-1">
                                                        {
                                                            validationErrors.dayOfBirth
                                                        }
                                                    </p>
                                                )}
                                            </>
                                        ) : (
                                            <p>{userData.dayOfBirth}</p>
                                        )}
                                    </div>
                                </div> */}

                                {/* <div className="flex justify-between items-start">
                                    <label className="font-medium">
                                        Giới tính:
                                    </label>
                                    <div className="w-1/2 text-right">
                                        {isEditing ? (
                                            <select
                                                className={`border rounded-lg p-2 w-full text-left ${
                                                    validationErrors.gender
                                                        ? "border-red-500"
                                                        : ""
                                                }`}
                                                name="gender"
                                                value={userData.gender}
                                                onChange={(e) =>
                                                    setUserData({
                                                        ...userData,
                                                        gender: e.target.value,
                                                    })
                                                }
                                                required
                                            >
                                                <option value="">
                                                    Chọn giới tính
                                                </option>
                                                <option value="Nam">Nam</option>
                                                <option value="Nữ">Nữ</option>
                                                <option value="Khác">
                                                    Khác
                                                </option>
                                            </select>
                                        ) : (
                                            <p>{userData.gender}</p>
                                        )}
                                    </div>
                                 </div> */}

                                <div className="flex justify-between items-start">
                                    <label className="font-medium">
                                        Địa chỉ:
                                    </label>
                                    <div className="w-1/2 text-right">
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                className={`border rounded-lg p-2 w-full text-left ${
                                                    validationErrors.address
                                                        ? "border-red-500"
                                                        : ""
                                                }`}
                                                name="address"
                                                value={userData.address}
                                                onChange={(e) =>
                                                    setUserData({
                                                        ...userData,
                                                        address: e.target.value,
                                                    })
                                                }
                                                placeholder="Địa chỉ"
                                                required
                                            />
                                        ) : (
                                            <p>{userData.address}</p>
                                        )}
                                    </div>
                                </div>

                                {/* <div className="flex justify-between items-center">
                                    <label className="font-medium">
                                        Tên tài khoản:
                                    </label>
                                    <p className="w-1/2 text-right">
                                        {userData.accountName}
                                    </p>
                                </div> */}

                                {/* Cập nhật phần nút */}
                                <div className="mt-8 flex justify-end space-x-4 border-t pt-4">
                                    {isEditing ? (
                                        <>
                                            <button
                                                onClick={handleUpdateUserData}
                                                className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 flex items-center"
                                            >
                                                <span className="text-center">
                                                    <i className="fas fa-save"></i>
                                                </span>
                                                Lưu thay đổi
                                            </button>
                                            <button
                                                onClick={handleEditToggle}
                                                className="px-6 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200 flex items-center"
                                            >
                                                <span className="text-center">
                                                    <i className="fas fa-times"></i>
                                                </span>
                                                Hủy
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={handleEditToggle}
                                            className="px-6 py-2.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-200 flex items-center"
                                        >
                                            <span className="mr-2">
                                                <i className="fas fa-edit"></i>
                                            </span>
                                            Sửa thông tin tài khoản
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p>Loading user data...</p>
                    )}
                </div>

                {/* Tách phần đổi mật khẩu thành component riêng */}
                {isEditing && (
                    <div className="bg-white p-6 rounded-lg shadow-lg mb-5">
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold mb-4">
                                Đổi mật khẩu
                            </h2>
                            <div className="flex justify-between items-start">
                                <label className="font-medium">
                                    Mật khẩu hiện tại:
                                </label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    className="border rounded-lg p-2 w-1/2"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                />
                            </div>
                            <div className="flex justify-between items-start">
                                <label className="font-medium">
                                    Mật khẩu mới:
                                </label>
                                <div className="w-1/2 relative">
                                    <input
                                        type="password"
                                        name="newPassword"
                                        className={`border rounded-lg p-2 w-full ${
                                            validationErrors.password
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                    />
                                    {validationErrors.password && (
                                        <p className="text-red-500 text-sm absolute right-0 mt-1">
                                            {validationErrors.password}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <label className="font-medium">
                                    Xác nhận mật khẩu mới:
                                </label>
                                <input
                                    type="password"
                                    name="confirmNewPassword"
                                    className="border rounded-lg p-2 w-1/2"
                                    value={passwordData.confirmNewPassword}
                                    onChange={handlePasswordChange}
                                />
                            </div>

                            {/* Thêm thông báo lỗi/thành công */}
                            <div className="mt-2">
                                {passwordError && (
                                    <p className="text-red-500 text-sm">
                                        <i className="fas fa-exclamation-circle mr-2"></i>
                                        {passwordError}
                                    </p>
                                )}
                                {passwordSuccess && (
                                    <p className="text-green-500 text-sm">
                                        <i className="fas fa-check-circle mr-2"></i>
                                        {passwordSuccess}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;

import { useEffect, useState } from "react";
import { API_URL } from "../config.js";
import { useLocation, useNavigate } from "react-router-dom";
import { notification, message } from "antd";
import PathNames from "../PathNames.js";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
const CheckoutBuyNow = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    console.log("user", user);
    const userId = user?.id;
    const productBuyNow = location.state?.product;
    const [paymentMethod, setPaymentMethod] = useState("Tiền mặt");
    const [accounts, setAccount] = useState([]);
    console.log("productBuyNow", productBuyNow);
    const [customerInfo, setCustomerInfo] = useState({
        name: user.name || "",
        email: localStorage.getItem("email"),
        phone: user.phone || "",
        address: user.address || "",
    });
    const [shippingOption, setShippingOption] = useState("store");
    const [totalAmount, setTotalAmount] = useState(productBuyNow?.price);
    const [notes, setNotes] = useState(""); // Lưu trữ ghi chú từ người dùng
    const [showDiscountDialog, setShowDiscountDialog] = useState(false);
    const [discounts, setDiscounts] = useState([]);
    const [selectedDiscount, setSelectedDiscount] = useState(null);
    const [discountedAmount, setDiscountedAmount] = useState(0);
    // Hàm lấy dữ liệu color
    const fetchColorSize = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/ColorSizes/${productBuyNow.colorSizeId}`);
            if (response.status === 200) {
                const data = response.data;
                return data
            } else {
                console.error(
                    `Failed to fetch ColorSizes: ${response.status} ${response.statusText}`
                );
                return {}
            }
        } catch (error) {
            console.error("Error fetching ColorSizes:", error);
            return {}
        }
    };
    const updateStock = async (colorSizeId, quantity) => {
        const updateColorSize = { ...await fetchColorSize(colorSizeId) };
        updateColorSize.quantity -= quantity;
        if(updateColorSize){
            try {
                const response = await fetch(
                    `${API_URL}/api/ColorSizes/${colorSizeId}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json", 
                        },
                        body: JSON.stringify(updateColorSize),
                    }
                );
                if (response.ok) {
                   
                    console.log('update color  succsess');
                }
            } catch (error) {
                console.error("Lỗi khi cập nhật Số lượng:", error);
                notification.error({
                    message: 'Thất bại',
                    description: "Lỗi khi cập nhật Số lượng: " + error.message,
                    duration: 4,
                    placement: "bottomRight",
                    showProgress: true,
                    pauseOnHover: true
                });
            }
        }
    };
    const fetchProduct = async (productId) => {
        try {
            const response = await axios.get(`${API_URL}/api/Products/${productId}`);
            if (response.status === 200) {
                const data = response.data;
                return data
            } else {
                console.error(
                    `Failed to fetch Products: ${response.status} ${response.statusText}`
                );
                return {}
            }
        } catch (error) {
            console.error("Error fetching Products:", error);
            return {}
        }
    };
    const updateSold = async (productId, quantity) => {
        const product = await fetchProduct(productId)
        try {
              const formData = new FormData();
        product.sold = product.sold + quantity
        Object.keys(product).forEach((key) => {
            formData.append(key, product[key]);
        });
        formData.append("createdAt", product.createdAt);
        
        const response = await fetch(
            `${API_URL}/api/Products/${productId}`,
            {
                method: "PUT",
                body: formData,
            }
        )
        console.log(response);
        if (response.status === 204) {
            console.log('update product succsess');
        }
        } catch (error) {
            Modal.error({
                title: "Lỗi",
                content:
                    error.response?.data?.message || "Không thể update product",
            });
        } 
    };
     useEffect(() => {
            const fetchDiscounts = async () => {
                try {
                    const response = await fetch(`${API_URL}/api/Promotions`);
                    if (!response.ok) {
                        throw new Error("Failed to fetch discount codes");
                    }
                    const data = await response.json();
                    // Sắp xếp theo phn trăm giảm giá từ cao đến thấp
                    const sortedCodes = data.sort(
                        (a, b) => b.value - a.value
                    );
                    const enableDiscount = sortedCodes.filter(
                        (discount) => new Date(discount.endAt).getTime() > Date.now()
                    );
                    let memberDiscount;
                    if (user?.role === 5) {
                        memberDiscount = {
                            name: "Ưu đãi khách hàng bạc",
                            value: 7,
                            minPrice: 300000,
                            maxValue: 300000,
                            code: "MEMBERVIP",
                        };
                    } else if (user?.role === 6) {
                        memberDiscount = {
                            name: "Ưu đãi khách hàng vàng",
                            value: 10,
                            minPrice: 300000,
                            maxValue: 450000,
                            code: "MEMBERVIP",
                        };
                    } else if (user?.role === 7) {
                        memberDiscount = {
                            name: "Ưu đãi khách hàng kim cương",
                            value: 15,
                            minPrice: 300000,
                            maxValue: 500000,
                            code: "MEMBERVIP",
                        };
                    }
        
                    // Cập nhật danh sách mã giảm giá
                    const updatedDiscounts = memberDiscount
                        ? [...enableDiscount, memberDiscount]
                        : enableDiscount;
                    setDiscounts(updatedDiscounts);
                    
                } catch (error) {
                    console.error("Error fetching discount codes:", error);
                }
            };
            fetchDiscounts();
        }, []);
    
    // Handler khi chọn mã giảm giá
    const handleSelectDiscount = (discount) => {
        setSelectedDiscount(discount);
        const discountAmount = Math.min(
            Math.floor((totalAmount * discount.value) / 100),
            discount.maxValue
        );
        setDiscountedAmount(discountAmount);
        setShowDiscountDialog(false);
    };

    // Thêm handler để xóa mã giảm giá
    const handleRemoveDiscount = () => {
        setSelectedDiscount(null);
        setDiscountedAmount(0);
    };
    const handleContinue = async () => {
        const finalAmount = totalAmount - discountedAmount;
        try {
            let userIdToUse = userId;

            if (userIdToUse == null) {
                // Gửi yêu cầu kiểm tra số điện thoại
                const response = await fetch(
                    `${API_URL}/api/Users/CheckUser/${customerInfo.phone}`
                );

                if (response.status === 404) {
                    // Không tìm thấy người dùng, tạo mới
                    const formData = new FormData();
                    formData.append("Name", customerInfo.name);
                    formData.append("Phone", customerInfo.phone);
                    formData.append(
                        "Address",
                        customerInfo.address || storeAddress
                    );
                    formData.append("Role", "1");
                    formData.append("TotalBuy", "0");

                    const createUserResponse = await fetch(
                        `${API_URL}/api/Users`,
                        {
                            method: "POST",
                            body: formData,
                        }
                    );
                    if (createUserResponse.status === 201) {
                        const createdUser = await createUserResponse.json();
                        userIdToUse = createdUser.id; // Lấy id của người dùng vừa tạo

                       
                    } else {
                        notification.error({
                            message: 'Thất bại',
                            description: 'Đã xảy ra lỗi khi tạo người dùng. Vui lòng thử lại.',
                            duration: 4,
                            placement: "bottomRight",
                            showProgress: true,
                            pauseOnHover: true
                        });
                        return; // Dừng quá trình nếu không tạo được user
                    }
                } else if (response.status === 200) {
                    // Người dùng đã tồn tại trong hệ thống và có tài khoản
                    const userCheck = await response.json();
                    const responseAccount = await fetch(
                        `${API_URL}/api/Accounts/CheckUser/${userCheck.id}`
                    );
                    if (responseAccount.status === 200) {
                        notification.info({
                            message: "Thông báo",
                            description:
                                "Bạn đã có tài khoản, hãy đăng nhập để tận hưởng ưu đãi của chúng tôi ngay",
                            duration: 4,
                            placement: "bottomRight",
                        });
                    } else {
                        // Người dùng chưa có tài khoản
                        const createAccount = confirm(
                            "Bạn đã từng mua hàng nhưng chưa có tài khoản. Bạn có muốn tạo tài khoản để hưởng ưu đãi không?"
                        );

                        if (createAccount) {
                            // Chuyển hướng sang trang đăng ký
                            window.location.href = "/register";
                            return; // Dừng xử lý để người dùng đăng ký
                        }
                    }
                    userIdToUse = userCheck.id; // Lấy id của người dùng đã tồn tại
                }
            }

            // Tạo dữ liệu đơn hàng
            const paymentData = {
                userId: userIdToUse,
                name: customerInfo.name,
                totalPrice: finalAmount,
                paymentMethod: paymentMethod,
                phone: customerInfo.phone,
                paymentStatus: "Chưa thanh toán",
                status: "Chờ xác nhận",
                address:
                    shippingOption === "store"
                        ? storeAddress
                        : customerInfo.address,
            };
            if (paymentMethod === "MoMo") {
                try {
                    // Gọi API tạo thanh toán MOMO
                    const paymentResponse = await fetch(`${API_URL}/api/Payment/create-payment`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            amount: finalAmount,
                            orderInfo: `Thanh toán đơn hàng cho ${customerInfo.name}`,
                        }),
                    });
    
                    const result = await paymentResponse.json();
    
                    if (!paymentResponse.ok) {
                        throw new Error(
                            result.message || "Lỗi kết nối đến cổng thanh toán"
                        );
                    }
    
                    if (result.payUrl) {
                        localStorage.setItem("pendingOrder", JSON.stringify({
                            userId:userId,
                            totalPrice: finalAmount,
                            paymentMethod:paymentMethod,
                            phone: customerInfo.phone,
                            note: notes,
                            address:
                                shippingOption === "store" ? storeAddress : customerInfo.address,
                            status: "Đã thanh toán",
                            cartItems:[productBuyNow], 
                        }));
                        // Chuyển hướng đến trang thanh toán MOMO
                        window.location.href = result.payUrl;
                    } else {
                       
                        throw new Error("Không nhận được URL thanh toán");
                    }
                } catch (error) {
                    console.error("Lỗi khi xử lý thanh toán:", error);
                    notification.error({
                        message: "Lỗi thanh toán",
                        description:
                            error.message || "Có lỗi xảy ra khi xử lý thanh toán",
                        duration: 4,
                        placement: "bottomLeft",
                    });
                }
            } else{
                 // Gửi yêu cầu tạo đơn hàng
            const orderResponse = await fetch(`${API_URL}/api/Orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(paymentData),
            });

            if (orderResponse.status === 201) {
                const orderRes = await orderResponse.json();
                const orderDetail = {
                    orderId: orderRes.id,
                    colorSizeId: productBuyNow.colorSizeId,
                    quantity: productBuyNow.quantity,
                    price: productBuyNow.price,
                    productId: productBuyNow.productId,
                };
                const orderDetailResponse = await fetch(
                    `${API_URL}/api/OrderDetails`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(orderDetail),
                    }
                );
                if (orderDetailResponse.status === 201) {
                    await updateSold(productBuyNow.productId, productBuyNow.quantity)
                    await updateStock(productBuyNow.colorSizeId, productBuyNow.quantity)
                    notification.success({
                        message: "Thành công!",
                        description: "Đơn hàng mới đã được tạo",
                        duration: 4,
                        placement: "bottomRight",
                    });
                    if (userId)
                     navigate("/my-orders");
                    else navigate("/");
                }
            } else {
                notification.error({
                    message: 'Thất bại',
                    description: 'Đã xảy ra lỗi khi tạo đơn hàng. Vui lòng thử lại.',
                    duration: 4,
                    placement: "bottomRight",
                    showProgress: true,
                    pauseOnHover: true
                });
            }
            }
           
        } catch (error) {
            console.error("Lỗi trong quá trình xử lý:", error);
            message.error("Đã xảy ra lỗi. Vui lòng thử lại sau.");
        }
    };

    const storeAddress = "806 QL22, ấp Mỹ Hoà 3, Hóc Môn, Hồ Chí Minh";

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h2 className="text-2xl font-semibold mb-4">Thông tin đặt hàng</h2>

            {/* Hiển thị thông tin khách hàng */}
            <div className="bg-white p-4 rounded-lg shadow mb-4">
                <h3 className="text-lg font-semibold mb-2">
                    Thông tin khách hàng
                </h3>
                {userId ? (
                    <>
                        <p>Tên: {customerInfo.name}</p>
                        <p>Email: {customerInfo.email}</p>
                        <p>Số điện thoại: {customerInfo.phone}</p>
                    </>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <label className="block mb-2">Tên:</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded-lg"
                                value={customerInfo.name}
                                onChange={(e) =>
                                    setCustomerInfo({
                                        ...customerInfo,
                                        name: e.target.value,
                                    })
                                }
                                placeholder="Nhập tên của bạn"
                            />
                        </div>

                        <div>
                            <label className="block mb-2">Số điện thoại:</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded-lg"
                                value={customerInfo.phone}
                                onChange={(e) =>
                                    setCustomerInfo({
                                        ...customerInfo,
                                        phone: e.target.value,
                                    })
                                }
                                placeholder="Nhập số điện thoại của bạn"
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="flex items-center">
                <img
                    src={
                        productBuyNow?.image
                            ? `data:image/jpeg;base64,${productBuyNow.image}`
                            : "/default-image.jpg"
                    }
                    alt={productBuyNow.name}
                    className="w-20 h-20 object-cover"
                />
                <div className="ml-4">
                    <div className="flex items-center gap-4">
                        <h3 className="text-lg font-semibold">
                            {productBuyNow.name}
                        </h3>
                        <p className="text-lg">
                            {productBuyNow?.color} - {productBuyNow?.size}
                        </p>
                    </div>

                    <p className="text-red-500">
                        {productBuyNow.price.toLocaleString()}{" "}
                      
                    </p>
                    <p>Số lượng: {productBuyNow.quantity}</p>
                </div>
            </div>

            {/* Thông tin giao / nhận hàng */}
            <div className="bg-white p-4 rounded-lg shadow mb-4">
                <h3 className="text-lg font-semibold mb-2">
                    Thông tin nhận hàng
                </h3>
                <div className="flex items-center space-x-8 mb-4">
                    <div
                        className="flex items-center cursor-pointer"
                        onClick={() => setShippingOption("store")}
                    >
                        <div
                            className={`w-5 h-5 rounded-full border-2 ${
                                shippingOption === "store"
                                    ? "border-blue-500 bg-blue-500"
                                    : "border-gray-500"
                            } mr-2 flex items-center justify-center`}
                        >
                            {shippingOption === "store" && (
                                <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                            )}
                        </div>
                        <label className="text-gray-800">
                            Nhận tại cửa hàng
                        </label>
                    </div>
                    <div
                        className="flex items-center cursor-pointer"
                        onClick={() => setShippingOption("delivery")}
                    >
                        <div
                            className={`w-5 h-5 rounded-full border-2 ${
                                shippingOption === "delivery"
                                    ? "border-blue-500 bg-blue-500"
                                    : "border-gray-500"
                            } mr-2 flex items-center justify-center`}
                        >
                            {shippingOption === "delivery" && (
                                <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                            )}
                        </div>
                        <label className="text-gray-800">
                            Giao hàng tận nơi
                        </label>
                    </div>
                </div>
                {shippingOption === "store" ? (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-2">
                                    Tỉnh / Thành phố
                                </label>
                                <select
                                    className="w-full p-2 border rounded-lg"
                                    disabled
                                >
                                    <option value="Ho Chi Minh">
                                        Hồ Chí Minh
                                    </option>
                                </select>
                            </div>
                            <div>
                                <label className="block mb-2">Quận/huyện</label>
                                <select
                                    className="w-full p-2 border rounded-lg"
                                    disabled
                                >
                                    <option value="Hoc Mon">Hóc Môn</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block mb-2">
                                Địa chỉ cửa hàng
                            </label>
                            <p className="bg-gray-100 p-2 rounded-lg">
                                {storeAddress}
                            </p>
                        </div>
                    </>
                ) : (
                    <>
                        <label className="block mb-2">Địa chỉ nhận hàng</label>
                        {userId ? (
                            <input
                                type="text"
                                className="w-full p-2 border rounded-lg mb-4"
                                value={customerInfo.address}
                                readOnly
                            />
                        ) : (
                            <input
                                type="text"
                                className="w-full p-2 border rounded-lg"
                                value={customerInfo.address}
                                onChange={(e) =>
                                    setCustomerInfo({
                                        ...customerInfo,
                                        address: e.target.value,
                                    })
                                }
                                placeholder="Nhập địa chỉ của bạn"
                            />
                        )}
                    </>
                )}
            </div>

            {/* Thêm ghi chú */}
            <div className="bg-white p-4 rounded-lg shadow mb-4">
                <h3 className="text-lg font-semibold mb-2">
                    Ghi chú khác (nếu có)
                </h3>
                <textarea
                    className="w-full p-2 border rounded-lg"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)} // Cập nhật ghi chú
                    placeholder="Nhập ghi chú"
                />
            </div>

            {/* Dropdown phương thức thanh toán */}
            <div className="bg-white p-4 rounded-lg shadow mb-4">
                <h3 className="text-lg font-semibold mb-2">
                    Phương thức thanh toán
                </h3>
                <select
                    className="w-full p-2 border rounded-lg"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                >
                    <option value="Tiền mặt">Tiền mặt</option>

                    <option value="MoMo">Thanh toán qua MOMO</option>
                    <option value="Thanh toán qua VNpay">
                        Thanh toán qua VNpay
                    </option>
                </select>
            </div>
            {/* Thêm nút và dialog mã giảm giá */}
            {userId && (
                <div>
                    <div className="bg-white p-4 rounded-lg shadow mb-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold">Mã giảm giá</h3>
                        {!selectedDiscount ? (
                            <button
                                onClick={() => setShowDiscountDialog(true)}
                                className="text-blue-500 hover:text-blue-700"
                            >
                                Chọn mã giảm giá
                            </button>
                        ) : (
                            <button
                                onClick={handleRemoveDiscount}
                                className="text-red-500 hover:text-red-700"
                            >
                                Xóa mã giảm giá
                            </button>
                        )}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                                * Đơn hàng chỉ được sử dụng 1 mã giảm giá
                            </p>
                    </div>
                </div>
            )}

            {selectedDiscount && (
                <div className="mt-2 p-2 bg-blue-50 rounded">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-medium">
                                {selectedDiscount.name}
                            </p>
                            <p className="text-sm text-gray-600">
                                Giảm {selectedDiscount.discountPercent}%
                                (Tối đa{" "}
                                {selectedDiscount.maxValue.toLocaleString()}
                                đ)
                            </p>
                            <p className="text-green-600 font-medium">
                                -{discountedAmount.toLocaleString()}đ
                            </p>
                        </div>
                        <button
                            onClick={handleRemoveDiscount}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
            
            {user && showDiscountDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 max-h-[75vh] overflow-y-auto min-w-[250px] w-[40%]">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">
                                Chọn mã giảm giá
                            </h3>
                            <button
                                onClick={() => setShowDiscountDialog(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="space-y-4 ">
                            {discounts.map((discount) => {
                                // Kiểm tra điều kiện áp dụng mã giảm giá
                                const isApplicable =
                                    totalAmount >= discount.minPrice;

                                return (
                                    <div
                                        key={discount.id}
                                        className={`border rounded p-3 ${
                                            isApplicable
                                                ? "hover:bg-gray-50"
                                                : "opacity-50"
                                        }`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-lg">
                                                    {discount.name}
                                                </h4>
                                                <div className="space-y-1 mt-1">
                                                    <p className="text-sm text-gray-600">
                                                        Giảm{" "}
                                                        {
                                                            discount.discountPercent
                                                        }
                                                        % (Tối đa{" "}
                                                        {discount.maxValue.toLocaleString()}
                                                        đ)
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Đơn tối thiểu{" "}
                                                        {discount.minPrice.toLocaleString()}
                                                        đ
                                                    </p>
                                                    {!isApplicable && (
                                                        <p className="text-xs text-red-500">
                                                            Đơn hàng chưa đt giá
                                                            trị tối thiểu
                                                        </p>
                                                    )}
                                                    {discount.endDate && (
                                                        <p className="text-xs text-gray-500">
                                                            HSD:{" "}
                                                            {new Date(
                                                                discount.endDate
                                                            ).toLocaleDateString(
                                                                "vi-VN"
                                                            )}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="ml-4 flex items-center">
                                                <button
                                                    className={`px-4 py-1.5 rounded text-sm w-32 ${
                                                        isApplicable
                                                            ? "bg-blue-500 hover:bg-blue-600 text-white"
                                                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                    }`}
                                                    onClick={() =>
                                                        isApplicable &&
                                                        handleSelectDiscount(
                                                            discount
                                                        )
                                                    }
                                                    disabled={!isApplicable}
                                                >
                                                    {isApplicable
                                                        ? "Áp dụng"
                                                        : "Không đủ điều kiện"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Cập nhật phần tổng tiền */}
            <div className="bg-white p-4 rounded-lg shadow mb-4">
                <h3 className="text-lg font-semibold mb-2">Tổng tiền</h3>
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span>Tạm tính:</span>
                        <span>{totalAmount.toLocaleString()}đ</span>
                    </div>

                     {selectedDiscount && (
                        <div className="flex justify-between text-green-600">
                            <span>Giảm giá:</span>
                            <span>-{discountedAmount.toLocaleString()}đ</span>
                        </div>
                    )}
                    <div className="flex justify-between font-semibold text-xl">
                        <span>Tổng cộng:</span>
                        <span className="text-red-500">
                            {(totalAmount - discountedAmount).toLocaleString()}đ
                        </span>
                    </div>
                </div>
            </div>

            <button
                onClick={handleContinue}
                className="w-full bg-blue-500 text-white p-4 rounded-lg text-center text-lg font-semibold"
            >
                Tiếp tục
            </button>
        </div>
    );
};

export default CheckoutBuyNow;

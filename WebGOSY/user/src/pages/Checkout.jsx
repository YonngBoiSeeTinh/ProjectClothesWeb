import { useEffect, useState } from "react";
import { API_URL } from "../config";
import { useLocation, useNavigate } from "react-router-dom";
import { notification } from "antd";
import PathNames from "../PathNames.js";
import {  useSelector } from "react-redux";
import axios from "axios";
const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [customerInfo, setCustomerInfo] = useState({
        name: "",
        // email: "",
        phone: "",
        address: "",
    });
    const [shippingOption, setShippingOption] = useState("store");
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [notes, setNotes] = useState(""); // Lưu trữ ghi chú từ người dùng
    const [showDiscountDialog, setShowDiscountDialog] = useState(false);
    const [discounts, setDiscounts] = useState([]);
    const [selectedDiscount, setSelectedDiscount] = useState(null);
    const [discountedAmount, setDiscountedAmount] = useState(0);

    const user = useSelector((state) => state.user);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchCustomerInfo = async () => {
            try {
                const response = await fetch(`${API_URL}/api/Users/${userId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch customer info");
                }
                const data = await response.json();
                setCustomerInfo({
                    name: data.name,
                    phone: data.phone,
                    address: data.address,
                });
            } catch (error) {
                console.error("Error fetching customer info:", error);
            }
        };

        if (location.state?.cartItems) {
            setCartItems(location.state.cartItems);
            setTotalAmount(location.state.total);
            console.log('cartItems' ,location.state.cartItems);
        } else {
            navigate(PathNames.CART);
        }

        if (userId) {
            fetchCustomerInfo();
        } else {
            console.error("No userId found in localStorage");
        }
    }, [userId, location.state, navigate]);

    const [productItems, setProductItems] = useState({});
    // Hàm lấy dữ liệu sản phẩm
    const fetchProducts = async () => {
        try {
            const promises = cartItems.map(async (item) => {
                const response = await fetch(`${API_URL}/api/Products/${item.productId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch product");
                }
                const data = await response.json();
                return { productId: item.productId, product: data };
            });

            const results = await Promise.all(promises);
            const productsMap = results.reduce((acc, { productId, product }) => {
                acc[productId] = product;
                return acc;
            }, {});

            setProductItems(productsMap);
        } catch (error) {
            console.error("Error fetching products:", error);
            setError(error.message);
        }
    };
    const [colorSizes, setColorSizes] = useState({});
     // Hàm lấy dữ liệu color
     const fetchColorSizes = async () => {
        try {
            const promises = cartItems.map(async (item) => {
                const response = await fetch(`${API_URL}/api/ColorSizes/${item.colorSizeId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch product");
                }
                const data = await response.json();
                return { colorSizeId: item.colorSizeId, color: data };
            });

            const results = await Promise.all(promises);
            const colorsMap = results.reduce((acc, { colorSizeId, color }) => {
                acc[colorSizeId] = color;
                return acc;
            }, {});

            setColorSizes(colorsMap);
        } catch (error) {
            console.error("Error fetching products:", error);
            setError(error.message);
        }
    };
    useEffect(() => {
        if (cartItems.length > 0) {
            fetchProducts();
            fetchColorSizes();
        }
    }, [cartItems]);

    // Thêm useEffect để fetch mã giảm giá
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
                        minPrice: 200000,
                        maxValue: 2500000,
                        code: "MEMBERVIP",
                    };
                } else if (user?.role === 6) {
                    memberDiscount = {
                        name: "Ưu đãi khách hàng vàng",
                        value: 10,
                        minPrice: 200000,
                        maxValue: 3500000,
                        code: "MEMBERVIP",
                    };
                } else if (user?.role === 7) {
                    memberDiscount = {
                        name: "Ưu đãi khách hàng kim cương",
                        value: 10,
                        minPrice: 200000,
                        maxValue: 4500000,
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

    const fetchColorSize = async (colorSizeId) => {
        try {
            const response = await axios.get(`${API_URL}/api/ColorSizes/${colorSizeId}`);
            if (response.status === 200) {
                const data = response.data;
                console.log("Fetched ColorSizes:", data);
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
       
        delete updateColorSize.updatedAt;
        console.log("Updated ColorSize:", updateColorSize);
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
                console.log("update color response", response);
             
                if (response.ok) {
                    notification.success({
                        message: 'Thành công',
                        description: "Số lượng đã được cập nhật thành công",
                        duration: 4,
                        placement: "bottomRight",
                        showProgress: true,
                        pauseOnHover: true
                    });
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
    const updateSold = async (productId, quantity) => {
        const product = productItems[productId];
        try {
              const formData = new FormData();
        product.sold = product.sold + quantity
        Object.keys(product).forEach((key) => {
            formData.append(key, product[key]);
        });
        formData.append("createdAt", product.createdAt);
    
        console.log("📝 FormData nội dung:");
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }
        const response = await fetch(
            `${API_URL}/api/Products/${productId}`,
            {
                method: "PUT",
                body: formData,
            }
        )
        console.log(response);
        if (response.status === 204) {
            
        }
        } catch (error) {
            Modal.error({
                title: "Lỗi",
                content:
                    error.response?.data?.message || "Không thể update product",
            });
        } 
    };

    const handleContinue = async () => {
        // Chuyển đổi số tiền về dạng số nguyên
        const finalAmount = totalAmount - discountedAmount;
        
        const paymentData = {
            userId: userId,
            name: customerInfo?.name,
            totalPrice: finalAmount,
            paymentMethod: paymentMethod,
            phone: customerInfo.phone,
            note: notes,
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
                        name:customerInfo.name,
                        totalPrice: finalAmount,
                        paymentMethod:paymentMethod,
                        phone: customerInfo.phone,
                        note: notes,
                        address:
                            shippingOption === "store" ? storeAddress : customerInfo.address,
                        status: "Đã thanh toán",
                        cartItems:cartItems, 
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
        } else if (paymentMethod === "COD") {
            try {
                // Tạo đơn hàng với trạng thái chờ xác nhận
                const orderResponse = await fetch(`${API_URL}/api/Orders`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(paymentData),
                });

                if (orderResponse.ok) {
                    const orderRes = await orderResponse.json();
                    for (const item of cartItems) {
                        const orderDetail = {
                            orderId: orderRes.id,
                            productId: item.productId,
                            colorSizeId: item.colorSizeId,
                            price: item.price,
                            quantity: item.quantity,
                        };
    
                        // Gọi API tạo chi tiết đơn hàng
                        const orderDetailResponse = await fetch(`${API_URL}/api/OrderDetails`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(orderDetail),
                        });
    
                        if (!orderDetailResponse.ok) {
                            console.error("Lỗi khi tạo chi tiết đơn hàng:", await orderDetailResponse.json());
                            throw new Error("Lỗi khi tạo chi tiết đơn hàng");
                        }
                        // Gọi API cập nhật số lượng colorSize
                        await updateSold(item.productId, item.quantity)
                        await updateStock(item.colorSizeId, item.quantity)
                    
                    }
                    // Xóa sản phẩm khỏi giỏ hàng
                    const ids = cartItems.map((item) => item.id);
                    const deleteResponse = await fetch(`${API_URL}/api/Carts/BySelectedItem/${userId}`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(ids),
                    });
                    if (!deleteResponse.ok) {
                        const errorData = await deleteResponse.json();
                        console.error("Lỗi API:", errorData);
                        throw new Error(errorData.message || "Lỗi khi xóa sản phẩm khỏi giỏ hàng");
                    }
                    notification.success({
                        message: "Đặt hàng thành công",
                        description:
                            "Đơn hàng của bạn đang chờ xác nhận. Chúng tôi sẽ liên hệ với bạn sớm nhất!",
                        duration: 4,
                        placement: "bottomLeft",
                        showProgress: true,
                        pauseOnHover: true,
                    });
                    navigate("/my-orders");
                } else {
                    throw new Error("Lỗi khi tạo đơn hàng");
                }
            } catch (error) {
                console.error("Lỗi khi tạo đơn hàng:", error);
                notification.error({
                    message: "Lỗi",
                    description: "Có lỗi xảy ra khi tạo đơn hàng",
                    duration: 4,
                    placement: "bottomLeft",
                    showProgress: true,
                    pauseOnHover: true,
                });
            }
           
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
                <p>Tên: {customerInfo.name}</p>
                {/* <p>Email: {customerInfo.email}</p> */}
                <p>Số điện thoại: {customerInfo.phone}</p>
            </div>

            {/* Hiển thị sản phẩm trong giỏ hàng của user */}
            {cartItems.length > 0 ? (
                cartItems.map((item) =>{
                        const product = productItems[item.productId];
                        const color = colorSizes[item.colorSizeId];
                        return (
                            <div
                                key={item.productId}
                                className="bg-white p-4 rounded-lg shadow mb-4"
                            >
                                <div className="flex items-center">
                                    {product ? (
                                        <img
                                            src={`data:image/jpeg;base64,${product?.image}`}
                                            alt={product?.name}
                                            className="object-cover w-20 h-20"
                                        />
                                    ) : (
                                        <p>Đang tải...</p>
                                    )}
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold">
                                            {product?.name} -  {color?.color} - {color?.size}
                                        </h3>
                                     
                                        <p className="text-red-500">
                                            {item.price.toLocaleString()}{" "}
                                            <span className="line-through text-gray-500">
                                                {item.price?.toLocaleString()}
                                            </span>
                                        </p>
                                        <p>Số lượng: {item.quantity}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    } 
                )
            ) : (
                <p>Giỏ hàng của bạn trống. Hãy mua gì đó rồi quay lại nhé</p>
            )}

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
                        <input
                            type="text"
                            className="w-full p-2 border rounded-lg mb-4"
                            value={customerInfo.address}
                            readOnly
                        />
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
                    
                    <option value="COD">Thanh toán khi nhận hàng</option>
                    <option value="MoMo">Thanh toán qua MOMO</option>
                </select>
            </div>

            {/* Thêm nút và dialog mã giảm giá */}
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
            </div>

            {/* Dialog mã giảm giá */}
            {showDiscountDialog && (
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

export default Checkout;

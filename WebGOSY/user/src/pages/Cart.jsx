import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import { notification } from "antd";
import PathNames from "../PathNames.js";
import {  useSelector } from "react-redux";
const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [cartAmount, setCartAmount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [itemToRemove, setItemToRemove] = useState(null);
    const [overStockError, setOverStockError] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const userId = user?.id
 
    const fetchCartItems = async () => {
           
        if (!userId) {
            console.error("Xin hãy đăng nhập để sử dụng tính năng này");
        }
        try {
            const response = await fetch(`${API_URL}/api/Carts/User/${user.id}`);
            if (!response.ok) {
                throw new Error("Failed to fetch cart items");
            }
            const data = await response.json();
            setCartItems(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching cart items:", error);
            setError(error.message);
            setLoading(false);
        }
    };
    useEffect(() => {
        if (userId) {
            fetchCartItems();
        }
    }, [userId]);

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
    // Gọi API khi cartItems thay đổi
    useEffect(() => {
        if (cartItems.length > 0) {
            fetchProducts();
            fetchColorSizes();
        }
    }, [cartItems]);
    // Tính tổng giá tiền
    const calculateTotal = () => {
        return cartItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );
    };

    // Xóa sản phẩm khỏi giỏ hàng
    const removeFromCart = async (id) => {
          try {
            const response = await fetch(`${API_URL}/api/Carts/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to remove item from cart");
            }

            setCartItems(prevItems => prevItems.filter(item => item.id !== id));
        } catch (error) {
            console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
        }
    };

    // Cập nhật số lượng sản phẩm trong giỏ hàng và kiểm tra tồn kho
    const updateQuantity = async (id,cart, newQuantity) => {
        const userId = localStorage.getItem("userId");
        const productInCart = cartItems.find(
            (item) => item.id === id
        );

        if (newQuantity <= 0) {
            setItemToRemove(productInCart);
            setShowConfirmDialog(true); // Hiển thị hộp thoại xác nhận xóa sản phẩm
        } else {
            try {
                const response = await fetch(
                    `${API_URL}/api/Carts/${id}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            ...Cart,
                            quantity: newQuantity,
                        }),
                    }
                );

                const data = await response.json();
                console.log('data ', data);
                if (response.status == 400) {
                    setOverStockError(data.message); // Hiển thị lỗi nếu vượt quá tồn kho
                } else {
                    console.log('update quantity');
                    setCartItems((prevItems) =>
                        prevItems.map((item) =>
                            item.id === id
                                ? { ...item, quantity: newQuantity }
                                : item
                        )
                    );
                    setOverStockError(null); // Xóa lỗi nếu cập nhật thành công
                }
            } catch (error) {
                console.error("Lỗi khi cập nhật số lượng:", error);
            }
        }
    };

    // Xác nhận xóa sản phẩm
    const handleConfirmRemove = () => {
        removeFromCart(itemToRemove.id);
        setShowConfirmDialog(false);
    };

    // Tính tổng tiền cho các sản phẩm được chọn
    const calculateSelectedTotal = () => {
        return cartItems
            .filter((item) => selectedItems.includes(item.id))
            .reduce((total, item) => total + item.price * item.quantity, 0);
    };

    // Xử lý chọn/bỏ chọn sản phẩm
    const handleSelectItem = (id) => {
        setSelectedItems((prev) =>
            prev.includes(id)
                ? prev.filter((id) => id !== id)
                : [...prev, id]
        );
    };

    // Thêm hàm xóa nhiều sản phẩm
    const removeMultipleFromCart = async (productIds) => {
        const userId = localStorage.getItem("userId");

        try {
            const response = await fetch(
                `${API_URL}/api/cart/${userId}/removeMultiple`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ productIds }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to remove items from cart");
            }

            // Cập nhật state local
            setCartItems((prevItems) =>
                prevItems.filter((item) => !productIds.includes(item.productId))
            );
            // Reset selected items
            setSelectedItems([]);
        } catch (error) {
            console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
        }
    };
    
    // Sửa hàm navigate để thêm callback xóa giỏ hàng
    const handleCheckout = () => {
        const selectedProducts = cartItems.filter((item) =>
            selectedItems.includes(item.id)
        );
        

        // Lưu selectedItems vào localStorage để có thể xóa sau khi thanh toán thành công
        localStorage.setItem("checkoutItems", JSON.stringify(selectedItems));

        navigate(PathNames.CHECKOUT, {
            state: {
                cartItems: selectedProducts,
                total: calculateSelectedTotal(),
            },
        });
    };  
    // Giao diện khi giỏ hàng trống
    // if (loading) {
    //     return <div>Đang tải...</div>;
    // }

    if (error) {
        return <div>{error}</div>;
    }

    if (cartItems.length === 0) {
        return (
            <div className="py-10 text-center">
                <h2 className="text-2xl font-semibold">
                    Giỏ hàng của bạn đang trống
                </h2>
                <p className="mt-4">Hãy chọn thêm sản phẩm để mua sắm nhé</p>
                <button
                    onClick={() => (window.location.href = "/")}
                    className="px-6 py-2 mt-6 text-white bg-blue-400 rounded-lg"
                >
                    Quay lại trang chủ
                </button>
            </div>
        );
    }
   
   
    return (
        <div className="container p-6 mx-auto">
            <h2 className="mb-4 text-2xl font-semibold">Giỏ hàng của bạn</h2>
            <div className="grid grid-cols-1 gap-4">
            {cartItems.map((item) => {
                    const product = productItems[item.productId];
                    const color = colorSizes[item.colorSizeId];
                    return (
                        <div
                            key={`${item.id}`}
                            className="flex justify-between items-center p-4 border rounded-lg"
                        >
                            <div className="flex items-center">
                                <div
                                    onClick={() => handleSelectItem(item.id)}
                                    className={`w-6 h-6 rounded-full border-2 cursor-pointer mr-4 flex items-center justify-center
                                    ${
                                        selectedItems.includes(item.id)
                                            ? "border-blue-500 bg-blue-500"
                                            : "border-gray-400"
                                    }`}
                                >
                                    {selectedItems.includes(item.id) && (
                                        <div className="w-3 h-3 bg-white rounded-full"></div>
                                    )}
                                </div>
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
                                        Tên sản phẩm: {product?.name || "Chưa rõ"}
                                    </h3>
                                    <p className="text-sm font-semibold">Màu: {color?.color} - {color?.size} </p>
                                    <p className="text-red-500">
                                        Giá: {item.price.toLocaleString()}đ
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => updateQuantity(item.id, item, item.quantity - 1)}
                                    className="px-3 py-1 border rounded-md"
                                >
                                    -
                                </button>
                                <span>{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item.id, item, item.quantity + 1)}
                                    className="px-3 py-1 border rounded-md"
                                >
                                    +
                                </button>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="px-4 py-2 text-white bg-blue-500 rounded-lg"
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    );
            })}
            </div>
           

            {/* Hiển thị thông báo lỗi vượt quá tồn kho */}
            {overStockError && (
                <div className="p-4 mt-4 text-red-700 bg-red-100 rounded-lg">
                    {overStockError}
                </div>
            )}

            {/* Hiển thị hộp thoại xác nhận xóa sản phẩm */}
            {showConfirmDialog && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                    <div className="p-6 bg-white rounded-lg">
                        <h3>Bạn có chắc muốn xóa sản phẩm khỏi giỏ hàng?</h3>
                        <div className="flex justify-end mt-4 space-x-4">
                            <button
                                onClick={() => setShowConfirmDialog(false)}
                                className="px-4 py-2 text-white bg-gray-500 rounded-lg"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleConfirmRemove}
                                className="px-4 py-2 text-white bg-blue-500 rounded-lg"
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-8 text-right">
                <p className="text-xl">
                    Tạm tính:{" "}
                    <span className="font-semibold text-red-500">
                        {calculateSelectedTotal().toLocaleString()}đ
                    </span>
                </p>
                <button
                    className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg disabled:bg-gray-400"
                    onClick={handleCheckout}
                    disabled={selectedItems.length === 0}
                >
                    Mua ngay ({selectedItems.length})
                </button>
            </div>
        </div>
    );
};

export default Cart;

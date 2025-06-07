import { useEffect, useState } from "react";
import { API_URL } from "../config";
import { useLocation, useNavigate } from "react-router-dom";
import { notification } from "antd";
import pagesName from "../PathNames";
import axios from "axios";

const PaymentResult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [productItems, setProductItems] = useState({});
    let isCalled = false;
    // Hàm xử lý kết quả thanh toán
    useEffect(() => {
       
        const handlePaymentResult = async () => {
            if (isCalled) return;  // Tránh gọi lại nhiều lần
            isCalled = true;

            const params = new URLSearchParams(location.search);
            const resultCode = params.get("resultCode");
            const message = params.get("message");
            console.log("resultCode",resultCode);
            console.log("message",message);
            if (message === "Success") {
                await fetchProducts();
                const orderData = localStorage.getItem("pendingOrder");

                if (orderData) {
                    addOrder(JSON.parse(orderData));
                } else {
                    notification.error({
                        message: "Lỗi",
                        description: "Không tìm thấy thông tin đơn hàng.",
                        duration: 4,
                        placement: "bottomRight",
                    });
                    navigate(pagesName.HOME);
                }
            } else {
                notification.error({
                    message: "Lỗi",
                    description: `Thanh toán thất bại: ${message}`,
                    duration: 4,
                    placement: "bottomRight",
                });
                navigate(pagesName.PAYMENT_FAILED);
            }
        };

        handlePaymentResult();
    }, []);

    // Hàm lấy thông tin sản phẩm
    const fetchProducts = async () => {
        try {
            const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
            const promises = cartItems.map(async (item) => {
                const response = await axios.get(`${API_URL}/api/Products/${item.productId}`);
                return { productId: item.productId, product: response.data };
            });

            const results = await Promise.all(promises);
            const productsMap = results.reduce((acc, { productId, product }) => {
                acc[productId] = product;
                return acc;
            }, {});

            setProductItems(productsMap);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    // Hàm thêm đơn hàng
    const addOrder = async (orderData) => {
        try {
            const orderResponse = await axios.post(`${API_URL}/api/Orders`, orderData);
            const orderRes = orderResponse.data;
            const { cartItems, userId } = orderData;

            for (const item of cartItems) {
                const orderDetail = {
                    orderId: orderRes.id,
                    productId: item.productId,
                    colorSizeId: item.colorSizeId,
                    price: item.price,
                    quantity: item.quantity,
                };

                await axios.post(`${API_URL}/api/OrderDetails`, orderDetail);
                await updateSold(item.productId, item.quantity);
                await updateStock(item.colorSizeId, item.quantity);
            }

            const ids = cartItems.map((item) => item.id);
            await axios.delete(`${API_URL}/api/Carts/BySelectedItem/${userId}`, {
                data: ids,
            });

            notification.success({
                message: "Đặt hàng thành công",
                description: "Đơn hàng của bạn đang chờ xác nhận. Chúng tôi sẽ liên hệ với bạn sớm nhất!",
                duration: 4,
                placement: "bottomLeft",
            });
            navigate(pagesName.PAYMENT_SUCCESS);
        } catch (error) {
            console.error("Lỗi khi tạo đơn hàng:", error);
        }
    };

    // Hàm cập nhật số lượng tồn kho
    const updateStock = async (colorSizeId, quantity) => {
        try {
            const response = await axios.get(`${API_URL}/api/ColorSizes/${colorSizeId}`);
            const colorSize = response.data;
            colorSize.quantity -= quantity;

            await axios.put(`${API_URL}/api/ColorSizes/${colorSizeId}`, colorSize);
            console.log("Cập nhật số lượng tồn kho thành công");
        } catch (error) {
            console.error("Lỗi khi cập nhật tồn kho:", error);
        }
    };

    // Hàm cập nhật số lượng bán
    const updateSold = async (productId, quantity) => {
        try {
            const product = { ...productItems[productId] };
            product.sold += quantity;

            const formData = new FormData();
            Object.keys(product).forEach((key) => {
                formData.append(key, product[key]);
            });

            await axios.put(`${API_URL}/api/Products/${productId}`, formData);
            console.log("Cập nhật số lượng bán thành công");
        } catch (error) {
            console.error("Lỗi khi cập nhật số lượng bán:", error);
        }
    };

    return (
        <div>
            <h1>Đang xử lý kết quả thanh toán...</h1>
        </div>
    );
};

export default PaymentResult;

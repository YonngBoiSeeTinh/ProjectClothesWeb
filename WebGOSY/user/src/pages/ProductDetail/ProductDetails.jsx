import { notification, Select } from "antd";
import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { API_URL } from "../../config";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, setUser } from "../../redux/userSlide";
import { useNavigate } from "react-router-dom";
import { ReviewsSection } from "./ReviewsSection";

const ProductDetails = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
   
    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState("");
    const user = useSelector((state) => state.user);
    const userId = user?.id;
    
    const [colorSizes, setColorSizes] = useState(null);
    const [availableColors, setAvailableColors] = useState([]);
    const [availableSizes, setAvailableSizes] = useState([]);
    const [chooseColor, setChooseColor] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(
                    `${API_URL}/api/Products/${productId}`
                );
                if (response.ok) {
                    const data = await response.json();
                    setProduct({ ...data });
                } else {
                    throw new Error("Failed to fetch product");
                }
            } catch (error) {
                console.error("Error fetching product:", error);
                setError("Failed to load product data. Please try again.");
            } finally {
                //setLoading(false);
            }
        };

        const fetchColorSize = async () => {
            try {
                const response = await fetch(
                    `${API_URL}/api/ColorSizes/ProductColorSize/${productId}`
                );
        
                if (response.ok) {
                    const data = await response.json();
             
                    // Lọc danh sách các màu có quantity > 0
                    const colorsWithQuantity = data.filter((item) => item.quantity > 0);
        
                    // Nhóm các màu duy nhất
                    const colors = [...new Set(colorsWithQuantity.map((item) => item.code))];
                    // set  lưu các giá trị duy nhất 
                    setAvailableColors(
                        colors.map((code) => ({
                            code,
                            items: colorsWithQuantity.filter((item) => item.code === code),
                        }))
                    );
        
                    setColorSizes(data);
                } else {
                    throw new Error("Failed to fetch product");
                }
            } catch (error) {
                console.error("Error fetching product:", error);
                setError("Failed to load product data. Please try again.");
            }
        };
        
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
        fetchCartItems();
        fetchColorSize();
        fetchProduct();
        
    }, [productId]);

  
    const handleColorClick = (colorGroup) => {
        setAvailableSizes(colorGroup.items);
        setChooseColor(colorGroup.code);
    };

    const handleSizeClick = (id) => {
        setSelectedColor  (colorSizes.find((item) => item.id === id));
    };

    const getStock = () => {
        let stock = 0;
        if (Array.isArray(colorSizes)) {
            stock = colorSizes
                .filter((item) => item.productId == productId)
                .reduce((total, item) => total + (item.quantity || 0), 0);
        }

        return stock;
    };

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (value > selectedColor.quantity) {
            setError("Số lượng bạn chọn đã đạt mức tối đa của sản phẩm này");
            notification.warning({
                message: "Lưu ý",
                description:
                    "Số lượng bạn chọn đã đạt mức tối đa của sản phẩm này",
                duration: 4,
                placement: "bottomRight",
                showProgress: true,
                pauseOnHover: true,
            });
        } else {
            setError("");
        }
        setQuantity(value);
    };
    const checkCartItem =(cartItem)=>{
        const check = cartItems.find((item) => item.productId == cartItem.productId && item.colorSizeId == cartItem.colorSizeId);
       
        return check;
    }
    const handleAddCart = async () => {
        if (!userId) {
            notification.warning({
                message: "Lưu ý",
                description: "Vui lòng đăng nhập để sử dụng giỏ hàng",
                duration: 4,
                placement: "bottomLeft",
                showProgress: true,
                pauseOnHover: true,
            });
            // window.location.href = "/login";
            return;
        }
      
        if (!product || !product.id) {
            notification.error({
                message: "Lỗi",
                description: "Không tìm thấy thông tin sản phẩm",
                duration: 4,
                placement: "bottomLeft",
                showProgress: true,
                pauseOnHover: true,
            });
            return;
        }

        if (quantity <= 0 || quantity > selectedColor.quantity) {
            notification.error({
                message: "Lỗi",
                description: "Số lượng không hợp lệ!",
                duration: 4,
                placement: "bottomLeft",
                showProgress: true,
                pauseOnHover: true,
            });
            return;
        }

        const cartItem = {
            productId: product.id,
            userId: userId,
            price: product.price,
            colorSizeId: selectedColor ? selectedColor.id : colorSizes[0]?.id,
            quantity: parseInt(quantity),
            // image: product.image,
        };
       const check = checkCartItem(cartItem)
       console.log('check cart ',check);
       if (check){
        const updatedData = {
            ...check,
            quantity: check.quantity + cartItem.quantity, 
        };
        try {
            const response = await fetch(`${API_URL}/api/Carts/${check?.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedData),
                cache: "no-store",
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(
                    data.message || "Có lỗi xảy ra khi thêm vào giỏ hàng"
                );
            }

            notification.success({
                message: "Thành công",
                description: "Đã thêm sản phẩm vào giỏ hàng",
                duration: 4,
                placement: "bottomLeft",
                showProgress: true,
                pauseOnHover: true,
            });

            // Reset quantity sau khi thêm thành công
            setQuantity(1);
        } catch (error) {
            console.error("Error adding to cart:", error);
            notification.error({
                message: "Lỗi",
                description: error.message,
                duration: 4,
                placement: "bottomLeft",
                showProgress: true,
                pauseOnHover: true,
            });
        }
       }else{
            try {
                const response = await fetch(`${API_URL}/api/Carts`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(cartItem),
                    cache: "no-store",
                });

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(
                        data.message || "Có lỗi xảy ra khi thêm vào giỏ hàng"
                    );
                }

                notification.success({
                    message: "Thành công",
                    description: "Đã thêm sản phẩm vào giỏ hàng",
                    duration: 4,
                    placement: "bottomLeft",
                    showProgress: true,
                    pauseOnHover: true,
                });

                // Reset quantity sau khi thêm thành công
                setQuantity(1);
            } catch (error) {
                console.error("Error adding to cart:", error);
                notification.error({
                    message: "Lỗi",
                    description: error.message,
                    duration: 4,
                    placement: "bottomLeft",
                    showProgress: true,
                    pauseOnHover: true,
                });
            }
       }

        
    };
    const handleBuyNow = () => {
        if (selectedColor) {
            const productBuyNow = {
                productId: productId,
                image: product.image,
                name: product.name,
                quantity: quantity,
                colorSizeId: selectedColor.id,
                color: selectedColor.color,
                size: selectedColor.size,
                price: product?.price,
            };
            navigate("/checkout-buynow", { state: { product: productBuyNow } });
        } else {
            notification.error({
                message: "Lỗi",
                description: "Vui lòng chọn màu trước khi mua",
                duration: 4,
                placement: "bottomRight",
                showProgress: true,
                pauseOnHover: true,
            });
        }
    };
    if (!product) {
        return (
            <div className="flex items-center justify-center min-h-screen p-5 text-lg">
                Đang tải thông tin sản phẩm...
            </div>
        );
    }


    return (
        <div className="mt-14">
            <div className="container mx-auto px-4 py-8 flex flex-col mb-24">
                <div className="flex flex-wrap mx-4 justify-center xl:ml-40 lg:ml-10">
                    {/* <!-- Product Images --> */}
                    <div className="w-full 2xl:w-[40%] xl:w-[50%] lg:w-[50%]  xl:max-h-[400px] sm:w-[50%] px-1 lg:px-4 mb-8  mx-auto">
                        <img
                            src={`data:image/jpeg;base64,${product.image}`}
                            alt={product.name}
                            className="w-full h-[33rem]   rounded-lg shadow-md mb-4 "
                            id="mainImage"
                        />
                        {/* sub image */}
                        {/* <div className="flex gap-4 py-4 justify-center overflow-x-auto">
                            <img
                                src="https://images.unsplash.com/photo-1505751171710-1f6d0ace5a85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxMnx8aGVhZHBob25lfGVufDB8MHx8fDE3MjEzMDM2OTB8MA&ixlib=rb-4.0.3&q=80&w=1080"
                                alt="Thumbnail 1"
                                className="size-16 sm:size-20 object-cover rounded-md cursor-pointer opacity-60 hover:opacity-100 transition duration-300"
                                onClick="changeImage(this.src)"
                            />
                            <img
                                src="https://images.unsplash.com/photo-1484704849700-f032a568e944?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw0fHxoZWFkcGhvbmV8ZW58MHwwfHx8MTcyMTMwMzY5MHww&ixlib=rb-4.0.3&q=80&w=1080"
                                alt="Thumbnail 2"
                                className="size-16 sm:size-20 object-cover rounded-md cursor-pointer opacity-60 hover:opacity-100 transition duration-300"
                                onClick="changeImage(this.src)"
                            />
                            <img
                                src="https://images.unsplash.com/photo-1496957961599-e35b69ef5d7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw4fHxoZWFkcGhvbmV8ZW58MHwwfHx8MTcyMTMwMzY5MHww&ixlib=rb-4.0.3&q=80&w=1080"
                                alt="Thumbnail 3"
                                className="size-16 sm:size-20 object-cover rounded-md cursor-pointer opacity-60 hover:opacity-100 transition duration-300"
                                onClick="changeImage(this.src)"
                            />
                            <img
                                src="https://images.unsplash.com/photo-1528148343865-51218c4a13e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwzfHxoZWFkcGhvbmV8ZW58MHwwfHx8MTcyMTMwMzY5MHww&ixlib=rb-4.0.3&q=80&w=1080"
                                alt="Thumbnail 4"
                                className="size-16 sm:size-20 object-cover rounded-md cursor-pointer opacity-60 hover:opacity-100 transition duration-300"
                                onClick="changeImage(this.src)"
                            />
                        </div> */}
                    </div>

                    {/* <!-- Product Details --> */}
                    <div className="w-full md:w-1/2 px-4">
                        {/* Show how many items are left in stock */}
                        <p className="text-md text-gray-600 mb-4">
                            Trạng thái:{" "}
                            {selectedColor.quantity > 0 ? (
                                <span
                                    className={
                                        selectedColor.quantity > 0
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }
                                >
                                    {selectedColor.quantity > 0
                                        ? `${selectedColor.quantity} sản phẩm còn lại`
                                        : "Hết hàng"}
                                </span>
                            ) : (
                                <span
                                    className={
                                        getStock() > 0
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }
                                >
                                    {getStock() > 0
                                        ? `${getStock()} sản phẩm còn lại`
                                        : "Hết hàng"}
                                </span>
                            )}
                        </p>

                        <p className="text-red-500 mb-1 text-lg">
                            {product.brand}
                        </p>
                        <h2 className="text-3xl font-bold mb-2">
                            {product.name}
                        </h2>
                        <p className="text-gray-600 mb-4 text-xs">
                            SKU: {product.productId}
                        </p>
                        <div className="mb-4">
                            <span className="text-2xl font-bold mr-2 text-primary">
                                {product.price.toLocaleString()} đ
                            </span>
                        </div>

                        <p className="text-gray-700 mb-6">
                            {product.description}
                        </p>

             

                        {/* Color Selection */}
                        {availableColors.length > 0 && (
                            <div className="my-6">
                                <label
                                    htmlFor="color"
                                    className="block text-lg font-semibold mb-1"
                                >
                                    Màu:
                                </label>

                                <div className="flex space-x-5">
                                    {availableColors.map((colorGroup, index) => (
                                        <button
                                            key={index}
                                            className={`w-9 h-9 rounded-full cursor-pointer border ${
                                                chooseColor === colorGroup.code
                                                ? "ring-1  ring-blue-500 "
                                                : "border-gray-300"
                                            }`}
                                            style={{ backgroundColor: colorGroup.code }}
                                            onClick={() => handleColorClick(colorGroup)}
                                        >
                                        </button>
                                    ))}
                                </div>
                               
                                {availableSizes.length > 0 && (
                                    <div className="flex gap-2 mt-4">
                                        {availableSizes.map((size) => (
                                            <div
                                                key={size.id}
                                                className={`p-2 h-9 border rounded cursor-pointer  min-w-[30px] flex justify-center ${
                                                    selectedColor?.id === size.id
                                                        ? "bg-indigo-300 text-white border-indigo-600   min-w-[30px]"
                                                        : "hover:bg-indigo-300 hover:text-white"
                                                }`}
                                                onClick={() => handleSizeClick(size.id)}
                                            >
                                                {size.size}
                                            </div>
                                        ))}
                                    </div>
                                )}     
                            </div>
                        )}

                        <div className="mb-6">
                            <label
                                htmlFor="quantity"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Số lượng:
                            </label>
                            <input
                                type="number"
                                name="quantity"
                                id="quantity"
                                min="1"
                                max={selectedColor.quantity}
                                value={quantity}
                                onChange={handleQuantityChange}
                                className="w-12 text-center rounded-md border-gray-300  shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                        </div>

                        <div className="flex space-x-4 mb-6">
                            <button
                                className="bg-indigo-400 flex gap-2 items-center text-white px-6 py-2 rounded-md hover:bg-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                onClick={handleAddCart}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="size-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                                    />
                                </svg>
                                Thêm vào giỏ
                            </button>
                            <button
                                className="bg-green-600 flex gap-2 items-center text-white px-6 py-2 rounded-md hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                onClick={handleBuyNow}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="size-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                                    />
                                </svg>
                                Mua ngay
                            </button>
                            
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2">
                                Tính năng nổi bật:
                            </h3>
                            <ul className="list-disc list-inside text-gray-700">
                                <li>Chất liệu thoải mái</li>
                                <li>Phong cách thời thượng</li>
                                <li>Sản xuất bằng công nghệ tiên tiến</li>
                                <li>
                                   Bền bỉ với thời gian
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <ReviewsSection productid={productId}/>
                
            </div>
           
            <script>
                {`
                    function changeImage(src) {
                    document.getElementById('mainImage').src = src;
                    }
                `}
            </script>
        </div>

        
    );
};

export default ProductDetails;

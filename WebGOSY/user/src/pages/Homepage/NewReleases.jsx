import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../../config";
import Heading from "../../shared/Heading";
import { notification } from "antd";
import PathNames from "../../PathNames.js";
import AddtoCartBtn from "../../shared/AddtoCartBtn.jsx";

const NewReleases = () => {
    const userId = localStorage.getItem("userId");
    const [products, setProducts] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/Products`);
                setProducts(response.data);
            } catch (error) {
                console.error("Lỗi khi tải sản phẩm:", error);
            }
        };
        fetchProducts();
        const fetchCartItems = async () => {
           
            if (!userId) {
                console.error("Xin hãy đăng nhập để sử dụng tính năng này");
            }
            try {
                const response = await fetch(`${API_URL}/api/Carts/User/${userId}`);
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
    }, []);

    const getProductsById = () => {
        return products
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sắp xếp giảm dần theo createdAt
            .slice(0, 4); // Lấy 4 sản phẩm đầu tiên
    };
    const NReleaseProducts = getProductsById();
    const fetchColorSize = async (productId) => {
        try {
            const response = await fetch(
                `${API_URL}/api/ColorSizes/ProductColorSize/${productId}`
            );

            if (response.ok) {
                const data = await response.json();
                console.log("data color", data);
                return data
            } else {
                throw new Error("Failed to fetch product");
            }
        } catch (error) {
            console.error("Error fetching product:", error);
            // setError("Failed to load product data. Please try again.");
        }
    };
    const checkCartItem =async(cartItem)=>{
        console.log("cart item", cartItems);
        const check = cartItems.find((item) => item.productId == cartItem.productId && item.colorSizeId == cartItem.colorSizeId);
        return check;
    }
    const handleAddtoCart = async (selectedProduct) => {
        const colors = await fetchColorSize(selectedProduct.id);

        if (!userId) {
            notification.warning({
                message: "Lưu ý!",
                description: "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng",
                duration: 4,
                placement: "bottomRight",
                showProgress: true,
                pauseOnHover: true,
            });
            return;
        }

        if (!selectedProduct || !selectedProduct.id) {
            notification.error({
                message: "Lỗi",
                description: "Không tìm thấy thông tin sản phẩm",
                duration: 4,
                placement: "bottomRight",
                showProgress: true,
                pauseOnHover: true,
            });
            return;
        }

        if (quantity <= 0 || quantity > selectedProduct.quantity) {
            notification.error({
                message: "Lỗi",
                description: "Số lượng không hợp lệ!",
                duration: 4,
                placement: "bottomRight",
                showProgress: true,
                pauseOnHover: true,
            });
            return;
        }

        const cartItem = {
            productId: selectedProduct.id,
            userId: userId,
            price: selectedProduct.price,
            colorSizeId: colors[0]?.id,
            quantity: parseInt(quantity),
        };

        const check = await checkCartItem(cartItem)
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
        }
        else{
            try {
                const response = await fetch(`${API_URL}/api/Carts`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(cartItem),
                });
    
                const data = await response.json();
    
                if (!response.ok) {
                    throw new Error(
                        data.message || "Có lỗi xảy ra khi thêm vào giỏ hàng"
                    );
                }
    
                notification.success({
                    message: "Thành công",
                    description: "Đã thêm sản phẩm vào giỏ hàng",
                    duration: 4,
                    placement: "bottomRight",
                    pauseOnHover: true,
                });
            } catch (error) {
                console.error("Error adding to cart:", error);
                notification.error({
                    message: "Lỗi",
                    description: error.message,
                    duration: 4,
                    placement: "bottomRight",
                    pauseOnHover: true,
                });
            }
        }
        
    };

    const handleProductClick = (productId) => {
        navigate(`${PathNames.PRODUCT_DETAILS}/${productId}`);
    };

    const formatCurrency = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    return (
        <div className="mb-32 mt-80">
            <div className="container">
                {/* Phần tiêu đề */}
                <Heading
                    title="Sản Phẩm Mới"
                    subtitle="Khám Phá Sản Phẩm Mới Nhất"
                />
                {/* Phần nội dung */}
                <div className="mb-10">
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 place-items-center ">
                        {/* card selection */}
                        {NReleaseProducts.map((item) => (
                            <div
                                key={item.id}
                                className="card_item w-[12rem] h-[20rem]  md:w-[19rem] md:h-[28rem]  mx-2 my-2 bg-white border xl:scale-90 lg:scale-90 md:scale-75 sm:scale-50 border-gray-200 rounded-2xl shadow dark:bg-gray-800 dark:border-gray-700"
                            >
                                {item.image ? (
                                    <img
                                        className="p-8 rounded-t-lg cursor-pointer h-[13rem] sm:h-[20rem] w-full"
                                        src={`data:image/jpeg;base64,${item.image}`}
                                        alt="product image"
                                        onClick={() =>
                                            handleProductClick(item.id)
                                        }
                                    />
                                ) : (
                                    <div className="h-[180px] w-[260px] flex items-center justify-center mb-3">
                                        <span>Missing Image</span>
                                    </div>
                                )}
                                <div className="px-5 pb-5">
                                    <Link
                                        to={`${PathNames.PRODUCT_DETAILS}/${item.id}`}
                                    >
                                        <h5 className="text-[16px] sm:text-xl md:text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                                            {item.name}
                                        </h5>
                                    </Link>
                                    <div className="sm:flex items-center justify-between mt-2  sm:mt-5">
                                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                                            {formatCurrency(item.price)}
                                        </span>

                                        <AddtoCartBtn
                                            onClick={() => handleAddtoCart(item)}
                                            className="text-white bg-blue-200 focus:outline-none font-medium rounded-xl hover:scale-105 ease transition-transform 
                                            text-sm px-5 py-2.5 text-center"
                                            text={"Thêm vào giỏ"}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewReleases;




// import axios from "axios";
// import { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { API_URL } from "../../config";
// import Heading from "../../shared/Heading";
// import { notification } from "antd";
// import PathNames from "../../PathNames.js";
// import AddtoCartBtn from "../../shared/AddtoCartBtn.jsx";

// const NewReleases = () => {
//     const userId = localStorage.getItem("userId");
//     const [products, setProducts] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const fetchProducts = async () => {
//             try {
//                 const response = await axios.get(
//                     "http://localhost:5000/api/products/"
//                 );
//                 const productsData = response.data;
//                 setProducts(productsData);
//             } catch (error) {
//                 console.error("Lỗi khi tải sản phẩm:", error);
//                 notification.error({
//                     message: "Lỗi",
//                     description: "Không thể tải sản phẩm",
//                     duration: 4,
//                     placement: "bottomRight",
//                 });
//             }
//         };
//         fetchProducts();
//     }, []);

//     const getProductsById = (ids) => {
//         return products.filter((product) => ids.includes(product.id));
//     };
    
//     const NReleaseProducts = getProductsById([
//         "SP028",
//         "SP022",
//         "SP035",
//         "SP036",
//     ]);

//     const handleAddtoCart = async (selectedProduct) => {
//         if (loading) return;

//         if (!userId) {
//             notification.warning({
//                 message: "Lưu ý!",
//                 description: "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng",
//                 duration: 4,
//                 placement: "bottomRight",
//                 showProgress: true,
//                 pauseOnHover: true,
//             });
//             navigate("/login");
//             return;
//         }

//         if (!selectedProduct || !selectedProduct.id) {
//             notification.error({
//                 message: "Lỗi",
//                 description: "Không tìm thấy thông tin sản phẩm",
//                 duration: 4,
//                 placement: "bottomRight",
//                 showProgress: true,
//                 pauseOnHover: true,
//             });
//             return;
//         }

//         const cartItem = {
//             productId: selectedProduct.id,
//             name: selectedProduct.name,
//             price: selectedProduct.price,
//             color: selectedProduct.color,
//             quantity: 1, // Default to 1 for quick add
//             image: selectedProduct.image,
//         };

//         setLoading(true);
        
//         try {
//             const response = await fetch(`${API_URL}/api/cart/${userId}/add`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify(cartItem),
//             });

//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(
//                     data.message || "Có lỗi xảy ra khi thêm vào giỏ hàng"
//                 );
//             }

//             notification.success({
//                 message: "Thành công",
//                 description: "Đã thêm sản phẩm vào giỏ hàng",
//                 duration: 4,
//                 placement: "bottomRight",
//                 pauseOnHover: true,
//             });
//         } catch (error) {
//             console.error("Error adding to cart:", error);
//             notification.error({
//                 message: "Lỗi",
//                 description: error.message,
//                 duration: 4,
//                 placement: "bottomRight",
//                 pauseOnHover: true,
//             });
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleProductClick = (productId) => {
//         navigate(`${PathNames.PRODUCT_DETAILS}/${productId}`);
//     };

//     const formatCurrency = (price) => {
//         return new Intl.NumberFormat("vi-VN", {
//             style: "currency",
//             currency: "VND",
//         }).format(price);
//     };

//     return (
//         <div className="mb-32 mt-80">
//             <div className="container">
//                 <Heading
//                     title="Sản Phẩm Mới"
//                     subtitle="Khám Phá Sản Phẩm Mới Nhất"
//                 />
//                 <div className="mb-10">
//                     <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 place-items-center">
//                         {NReleaseProducts.map((item) => (
//                             <div
//                                 key={item.id}
//                                 className="w-[20rem] bg-white border xl:scale-100 lg:scale-90 md:scale-75 sm:scale-50 border-gray-200 rounded-2xl shadow dark:bg-gray-800 dark:border-gray-700"
//                             >
//                                 {item.image ? (
//                                     <img
//                                         className="p-8 rounded-t-lg cursor-pointer"
//                                         src={`${API_URL}/${item.image}`}
//                                         alt="product image"
//                                         onClick={() => handleProductClick(item.id)}
//                                     />
//                                 ) : (
//                                     <div className="h-[180px] w-[260px] flex items-center justify-center mb-3">
//                                         <span>Missing Image</span>
//                                     </div>
//                                 )}
//                                 <div className="px-5 pb-5">
//                                     <Link
//                                         to={`${PathNames.PRODUCT_DETAILS}/${item.id}`}
//                                     >
//                                         <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
//                                             {item.name}
//                                         </h5>
//                                     </Link>
//                                     <div className="flex items-center justify-between mt-5">
//                                         <span className="text-xl font-bold text-gray-900 dark:text-white">
//                                             {formatCurrency(item.price)}
//                                         </span>
//                                         <AddtoCartBtn
//                                             onClick={() => handleAddtoCart(item)}
//                                             disabled={loading}
//                                             className={`text-white bg-[#f42c37] focus:outline-none font-medium rounded-xl hover:scale-105 ease transition-transform text-sm px-5 py-2.5 text-center ${
//                                                 loading ? 'opacity-50 cursor-not-allowed' : ''
//                                             }`}
//                                             text={loading ? "Đang thêm..." : "Thêm vào giỏ"}
//                                         />
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default NewReleases;
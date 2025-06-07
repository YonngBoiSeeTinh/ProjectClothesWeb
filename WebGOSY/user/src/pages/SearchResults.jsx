import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import PathNames from "../PathNames.js";
import { Spin, Pagination } from "antd"; // Import Spin for loading animation and Pagination

const SearchResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const filter = location.state?.searchQuery;
    const [products, setProducts] = useState([]);
    const [serchProduct, setSerchProducts] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 8;

    useEffect(() => { 
        fetchProducts();
    }, []);
   
    useEffect(() => {
        if (filter) {
            setSerchProducts(  products.filter((pro) => pro.name.toLowerCase().includes(filter.toLowerCase())))
            
        }
    }, [filter]);

    const fetchProducts = async () => {
        setLoading(true); // Start loading

        try {
            const response = await fetch(
                `${API_URL}/api/Products`
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error("Error fetching search results:", error);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const handleProductClick = (productId) => {
        navigate(`${PathNames.PRODUCT_DETAILS}/${productId}`);
    };

    // Tính toán sản phẩm cho trang hiện tại
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = serchProduct.slice(indexOfFirstProduct, indexOfLastProduct);

    // Xử lý khi thay đổi trang
    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <main className="max-w-6xl p-4 mx-auto">
            <h1 className="mb-8 text-4xl font-bold text-center">
                Search Results
            </h1>
            {loading ? ( // Show loading spinner if loading
                <div className="flex justify-center">
                    <Spin size="large" />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {currentProducts.length > 0 ? (
                            currentProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="transition-shadow duration-300 bg-white border border-gray-200 rounded-lg shadow-md cursor-pointer hover:shadow-lg"
                                    onClick={() => handleProductClick(product.id)}
                                >
                                    <img
                                         src={`data:image/jpeg;base64,${product.image}`}
                                        alt={product.name}
                                        className="object-cover w-full rounded-t-lg h-80"
                                    />
                                    <div className="p-4">
                                        <h2 className="text-lg font-semibold">
                                            {product.name}
                                        </h2>
                                        <p className="text-[#4B5563] mb-2 text-[19px]">
                                            Price:{" "}
                                            <span className="font-bold">
                                                {product.price.toLocaleString()} VND
                                            </span>
                                        </p>
                                        <button className="w-full bg-[#DC2626] text-white py-2 rounded-md hover:bg-[#B91C1C] transition-colors duration-200">
                                            Mua ngay
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-xl text-gray-600">
                                No products found.
                            </p>
                        )}
                    </div>
                    {products.length > productsPerPage && (
                        <div className="flex justify-center mt-8">
                            <Pagination
                                current={currentPage}
                                total={products.length}
                                pageSize={productsPerPage}
                                onChange={handlePageChange}
                                showSizeChanger={false}
                            />
                        </div>
                    )}
                </>
            )}
        </main>
    );
};

export default SearchResults;

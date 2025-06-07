import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config.js';

const Homepage = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [visibleProducts, setVisibleProducts] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products`);
      const data = await response.json();

      if (response.ok) {
        setProducts(data);
      } else {
        throw new Error(data.message || 'Lỗi khi tải sản phẩm');
      }
    } catch (err) {
      setError('Lỗi khi tải sản phẩm.');
      console.error('Lỗi khi tải sản phẩm:', err);
    }
  };

  const filteredProducts = products.filter(product => product.quantity > 0);

  const loadMoreProducts = () => {
    setVisibleProducts(prevVisibleProducts => prevVisibleProducts + 10);
  };

  const remainingProducts = filteredProducts.length - visibleProducts;

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <main className="max-w-6xl mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">Trang Chủ</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.slice(0, visibleProducts).map(product => (
          <div key={product.id} className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer" onClick={() => handleProductClick(product.id)}>
            <img
              src={`data:image/jpeg;base64,${product.image}`}
              alt={product.name}
              className="w-full h-80 rounded-t-lg"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-red-600 mb-2 text-[19px]">
                Giá: <span className="font-bold">{product.price.toLocaleString()} VND</span>
              </p>
              <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-200">Mua ngay</button>
            </div>
          </div>
        ))}
      </div>

      {remainingProducts > 0 && (
        <div className="text-center mt-6">
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors duration-200" onClick={loadMoreProducts}>
            Xem thêm {remainingProducts} sản phẩm
          </button>
        </div>
      )}
    </main>
  );
};

export default Homepage;

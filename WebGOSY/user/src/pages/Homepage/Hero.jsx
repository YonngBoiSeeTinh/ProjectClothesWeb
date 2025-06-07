import { Carousel } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {  API_URL   } from "../../config";
import PathNames from "../../PathNames.js";
import Button from "../../shared/Button.jsx";
import { BorderOutlined } from "@ant-design/icons";


const Hero = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/Products`);
                const productsData = response.data;
                setProducts(productsData);
            } catch (error) {
                console.error(error);
            }
        };
        fetchProducts();
    }, []);

    const getProductsById = (ids) => {
        return products.filter((product) => ids.includes(product.id));
    };
    const heroProducts = getProductsById([4, 5]);

    const handleHeroClick = (productId) => {
        navigate(`${PathNames.PRODUCT_DETAILS}/${productId}`);
    };
    return (
        <div className="container">
            <div className="overflow-hidden rounded-3xl min-h-[340px] xl:min-h-[650px] mx-3 flex justify-center items-center mt-10 mb-11 shadow-[0px_8px_20px_rgba(0,0,0,0.5)]">
                <div className="container pb-8 sm:pb-0">
                    <Carousel
                        dots={false}
                        arrows={false}
                        infinite={true}
                        speed={800}
                        draggable={true}
                        autoplay={true}
                        autoplaySpeed={4000}
                        easing="ease-in-out"
                    >
                      {heroProducts.map((product) => (
                        <div key={product.id} className="py-2 sm:py-12 lg:py-16">
                            <div className="flex flex-row  items-center items-start mx-4 px-2 gap-8 xl:gap-16 xl:px-24">
                            {/* Text content section */}
                            <div className="flex flex-col justify-center gap-4 text-left w-1/2">
                                <h1
                                className="text-3xl sm:text-5xl lg:text-7xl font-bold text-indigo-200 mb-4"
                                style={{ textShadow: "-2px 5px 8px rgb(68, 48, 159)" }}
                                >
                                {product.promo} % Off
                                </h1>
                                <h2
                                className="text-lg sm:text-2xl lg:text-3xl uppercase text-gray-200 font-bold leading-none mb-4"
                                style={{ textShadow: "2px 2px 1px rgba(0, 0, 0, 0.5)" }}
                                >
                                {product.name}
                                </h2>
                                <h3
                                className="text-lg sm:text-2xl lg:text-3xl text-gray-200 font-bold leading-none"
                                style={{ textShadow: "1px 2px 1px rgba(0, 0, 0, 0.5)" }}
                                >
                                Sep 10 - Sep 17
                                </h3>
                                <div
                                className="rounded-lg border-2 border-indigo-300 cursor-pointer w-40 sm:w-60 h-10 sm:h-12 p-2 hover:bg-indigo-100 transition-all duration-300 flex items-center justify-center my-4 sm:my-8"
                                onClick={() => handleHeroClick(product.id)}
                                >
                                <p className="text-indigo-300 font-bold text-xl sm:text-2xl">Mua Ngay</p>
                                </div>
                            </div>

                            {/* Image section */}
                            <div className="w-1/2 sm:w-3/4 order-1 sm:order-2">
                                <div
                                data-aos="fade-left"
                                data-aos-duration="500"
                                data-aos-once={false}
                                className="flex justify-center"
                                >
                                <img
                                    src={`data:image/jpeg;base64,${product.image}`}
                                    alt=""
                                    className="w-50 sm:w-90 lg:w-96 h-auto object-contain mx-auto relative z-40"
                                />
                                </div>
                            </div>
                            </div>
                        </div>
                        ))}

                    </Carousel>
                </div>
            </div>
        </div>
    );
};

export default Hero;

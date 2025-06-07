import { useNavigate } from "react-router-dom";
import PathNames from "../../PathNames.js";

const Banner = ({ data }) => {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate(`${PathNames.PRODUCT_DETAILS}/9`);
    };
    return (
        <div className="min-h-[550px] flex justify-center items-center py-12">
            <div className="container">
                <div
                    className={`grid grid-cols-1 lg:grid-cols-3 gap-6 justify-center items-center text-white rounded-3xl ${data.bgColor}`}
                >
                    {/* first col */}
                    <div className="p-6 sm:p-8">
                        <h1
                            data-aos="fade-up"
                            data-aos-duration="500"
                            data-aos-once={false}
                            data-aos-anchor-placement="bottom-bottom"
                            className="font-bold uppercase 2xl:text-4xl xl:text-6xl lg:text-5xl md:text-5xl text-2xl"
                            style={{textShadow:"-2px 5px 8px rgb(85, 72, 141)" }}
                        >
                            {data.title}
                        </h1>
                        <p
                            data-aos="fade-up"
                            data-aos-duration="500"
                            data-aos-delay="250"
                            data-aos-once={false}
                            data-aos-anchor-placement="center-bottom"
                            className="text-sm mt-8  hidden md:block"
                        >
                            {data.date}
                        </p>
                    </div>

                    {/* second col */}
                    <div
                        className="flex items-center h-full"
                        data-aos="zoom-in"
                        data-aos-duration="500"
                        data-aos-once={false}
                        data-aos-anchor-placement="center-bottom"
                    >
                        <img
                            src={data.image}
                            alt=""
                            className="scale-125 w-[250px] md:x-[340px] mx-auto drop-shadow-2xl object-cover hover:-translate-y-1 transition-transform duration-200 ease-linear"
                        />
                    </div>

                    {/* third col */}
                    <div className="flex flex-col justify-center gap-4 p-6 sm:p-8 ">
                        <p
                            className="text-xl font-bold "
                            data-aos="fade-up"
                            data-aos-duration="500"
                            data-aos-once={false}
                            data-aos-anchor-placement="bottom-bottom"
                            style={{textShadow:"-2px 12px 8px rgb(12, 0, 65)" }}
                        >
                            {data.title2}
                        </p>
                        <p
                            className="2xl:text-xl xl:text-lg font-bold  hidden lg:block"
                            data-aos="fade-up"
                            data-aos-duration="500"
                            data-aos-once={false}
                            data-aos-anchor-placement="bottom-bottom"
                            
                            
                        >
                            {data.title3}
                        </p>
                        <p
                            data-aos="fade-left"
                            data-aos-duration="500"
                            data-aos-once={false}
                            data-aos-anchor-placement="bottom-bottom"
                            className="font-bold 2xl:text-6xl xl:text-5xl lg:text-4xl text-5xl  hidden lg:block "
                        >
                            {data.discount}
                        </p>
                        <p
                            data-aos="fade-up"
                            data-aos-duration="500"
                            data-aos-once={false}
                            data-aos-anchor-placement="bottom-bottom"
                            className="text-sm leading-5 tracking-wide"
                            style={{textShadow:"-2px 8px 8px rgb(11, 5, 37)" }}
                        >
                            {data.title4}
                        </p>
                        <div
                            data-aos="fade-up"
                            data-aos-duration="500"
                            data-aos-delay="250"
                            data-aos-once={false}
                            data-aos-anchor-placement="top-bottom"
                        >
                            <button
                                className={`card_item bg-white py-2 px-4 rounded-full 
                                            text-indigo-500 font-semibold w-60 md:w-37 lg:w-60 
                                            border-2 border-indigo-500`}
                                onClick={() => handleButtonClick()}
                            >
                                Mua Ngay
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Banner;

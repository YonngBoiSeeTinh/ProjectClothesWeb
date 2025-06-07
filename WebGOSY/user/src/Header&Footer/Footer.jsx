import {
    AmazonOutlined,
    FacebookOutlined,
    InstagramOutlined,
    MobileOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import PathNames from "../PathNames.js";
import LocationArrow from "../assets/svg/LocationArrow.jsx";
import Partners from "../pages/Homepage/Partners.jsx";

const FooterLinks = [
    {
        label: "Trang Chủ",
        link: `${PathNames.HOMEPAGE}`,
        onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }), // Scrolls to top on click
    },
    {
        label: "Giới Thiệu",
        link: `${PathNames.ABOUT}`,
    },
    {
        label: "Câu chuyện",
        link: `${PathNames.STORIES}`,
    },
    {
        label: "Tuyển Dụng",
        link: `${PathNames.VACANCIES}`,
    },
];

const SupportLinks = [
    {
        label: "Câu Hỏi Thường Gặp",
        link: `${PathNames.FAQ}`,
    },
    {
        label: "Liên hệ với chúng tôi",
        link: `${PathNames.CONTACTUS}`,
    },
    {
        label: "Chính Sách Bảo Mật",
        link: `${PathNames.PRIVACYPOLICY}`,
    },
    {
        label: "Điều Khoản & Điều Kiện",
        link: `${PathNames.TERMS}`,
    },
];

const Footer = () => {
    const location = useLocation();
    const [isHomepage, setIsHomepage] = useState(location.pathname === PathNames.HOMEPAGE);

    useEffect(() => {
        setIsHomepage(location.pathname === PathNames.HOMEPAGE);
    }, [location.pathname]);

    return (
        <>
            {isHomepage && <Partners />}
            <footer className="dark:bg-gray-950">
                <div className="container">
                    <div className="grid md:grid-cols-3 pb-14 pt-5">
                        {/* Thông tin công ty */}
                        <div className="py-8 px-4">
                            <Link
                                to="#"
                                className="text-indigo-300 font-bold tracking-widest text-2xl uppercase sm:text-3xl"
                            >
                              GOSY STORE
                            </Link>
                            <p className="text-gray-600 dark:text-white/70 lg:pr-24 pt-3">
                               Cửa hàng thời trang phong cách, chất lượng, uy tín hàng đầu Việt Nam
                            </p>
                            {/* <p className="text-gray-500 mt-4">
                            Beautifully cooked with love by <span className="text-primary">Sphonec</span>
                        </p> */}
                        </div>

                        {/* Liên kết footer */}
                        <div className="col-span-2 grid grid-cols-2 sm:grid-cols-3 md:pl-10">
                            <div className="py-8 px-4">
                                <h1 className="text-xl font-bold sm:text-left mb-3">
                                    Điều Hướng
                                </h1>
                                <ul className="space-y-3">
                                    {FooterLinks.map((link, index) => (
                                        <li key={index}>
                                            <Link
                                                to={link.link}
                                                onClick={link.onClick}
                                                className="text-gray-600 dark:text-gray-400 hover:dark:text-white hover:text-black duration-300"
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Cột liên kết thứ hai */}
                            <div className="py-8 px-4">
                                <h1 className="text-xl font-bold sm:text-left mb-3">
                                    Hỗ Trợ
                                </h1>
                                <ul className="space-y-3">
                                    {SupportLinks.map((link, index) => (
                                        <li key={index}>
                                            <Link
                                                to={link.link}
                                                className="text-gray-600 dark:text-gray-400 hover:dark:text-white hover:text-black duration-300"
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Địa chỉ công ty */}
                            <div className="py-8 px-4 col-span-2 sm:col-auto">
                                <h1 className="text-xl font-bold sm:text-left mb-3">
                                    Kết Nối
                                </h1>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <LocationArrow />
                                        <p>Sư Vạn Hạnh, TP. Hồ Chí Minh</p>
                                    </div>
                                    <div className="flex items-center gap-3 mt-6">
                                        <MobileOutlined />
                                        <p>+84 947500422</p>
                                    </div>

                                    {/* Liên kết mạng xã hội */}
                                    <div className="flex item-center gap-3 mt-6">
                                        <Link
                                            to="https://www.instagram.com/thepinkkitten/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <InstagramOutlined className="text-3xl hover:text-primary duration-300" />
                                        </Link>
                                        <Link
                                            to="https://www.facebook.com/lamnguyen.10082004"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <FacebookOutlined className="text-3xl hover:text-primary duration-200" />
                                        </Link>
                                        <Link
                                            to="https://www.amazon.com/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <AmazonOutlined className="text-3xl hover:text-primary duration-200" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;

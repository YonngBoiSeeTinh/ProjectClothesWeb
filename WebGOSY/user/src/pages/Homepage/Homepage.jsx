import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import bannerImg from "../../assets/fakeAssets/gcjacket.png";
import AboutUsSection from "./AboutUsSection";
import Banner from "./Banner";
import Blogs from "./Blogs";
import Categories from "./Category";

import Hero from "./Hero";
import NewReleases from "./NewReleases";
import Partners from "./Partners";
import Services from "./Services";

const BannerData = {
    discount: "Giá cực sốc",
    title: "Sản phẩm kỷ niệm",
    date: "Từ ngày 31/10 đến ngày 20/11",
    image: bannerImg,
    title2: "Floral Jacket Specical Edittion",
    title3: "Khuyến mãi mùa đông",
    title4: "Sở hữu Phiên bản giới hạn ngay",
    bgColor: "bg-gradient-to-br from-black/90 to-black/70",
};

const Homepage = () => {

    useEffect(() => {
        AOS.init({
            duration: 1000,
            easing: "ease-in-sine",
            delay: 100,
            offset: 100,
        });
        AOS.refresh();
    }, []);

    // NOTE: Get the scroll position of the document
    window.addEventListener(
        "scroll",
        () => {
            document.body.style.setProperty(
                "--scroll",
                window.pageYOffset /
                    (document.body.offsetHeight - window.innerHeight)
            );
        },
        false
    );

    return (
        <main className="bg-white dark:bg-gray-900 dark:text-white duration-200 overflow-hidden">
            <Hero />
            <Categories />
            <Services />
            <Banner data={BannerData} />
            <AboutUsSection />
            <NewReleases />
            <Blogs />
            {/* <Partners /> */}
        </main>
    );
};

export default Homepage;

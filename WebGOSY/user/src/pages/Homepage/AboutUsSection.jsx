import { Link } from "react-router-dom";
import AboutUsImg from "../../assets/fakeAssets/fashion.jpg";
import PathNames from "../../PathNames.js";
import ArrowTextBtn from "../../shared/ArrowTextBtn";

const AboutUsSection = () => {
    return (
        <div className="flex items-center justify-center my-48  ">
            <div className="2xl:max-w-[79rem] xl:max-w-[72rem] mx-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div
                    className="flex flex-col justify-center"
                    data-aos="fade-up"
                    data-aos-duration="500"
                    data-aos-once={false}
                    data-aos-anchor-placement="center-bottom"
                >
                    <div className="max-w-[23rem]">
                        <h1 className="lg:text-5xl md:text-5xl sm:text-5xl text-3xl font-bold mb-4 text-gray-200"    style={{textShadow:"0 4px 5px rgb(87, 68, 154)" }}>
                            Đây là GOSY
                        </h1>
                        <p className="text-lg mb-4 tracking-tight text-gray-400">
                            {`Khám phá và định hình phong cách cá nhân của bạn cùng những item tuyệt vời của chúng tôi nào!`}
                        </p>
                    </div>

                    <Link
                        to={PathNames.ABOUT}
                        className="text-lg font-semibold flex items-center "
                    >
                        <ArrowTextBtn text="Về chúng tôi" />
                    </Link>
                </div>

                <div
                     className="flex flex-col justify-center"
                     data-aos="fade-up"
                     data-aos-duration="500"
                     data-aos-once={false}
                     data-aos-anchor-placement="center-bottom"
                    
                >
                    <img
                        src={AboutUsImg}
                        alt="Person holding a Fairphone with a message 'Change is in your hands'"
                        className="rounded-3xl shadow-2xl h-[25rem] sm:h-[45rem] "
                    />
                </div>
            </div>
        </div>
    );
};

export default AboutUsSection;

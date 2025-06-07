import { useEffect } from "react";

const Stories = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <main className="main">
            {/* Phần Hero */}
            <section
                className="hero-section h-96 flex items-center justify-center text-center text-white"
                style={{
                    background:
                        "linear-gradient(to bottom, rgba(30, 58, 138, 0.8), rgba(30, 58, 138, 0.8)), url('/path-to-your-background-image.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="bg-black bg-opacity-70 p-10 rounded-lg shadow-lg">
                    <h1 className="text-5xl font-bold">
                        Câu Chuyện Của Chúng Tôi
                    </h1>
                    <p className="mt-4 text-xl">
                        Khám phá hành trình phát triển và những trải nghiệm
                        khách hàng
                    </p>
                </div>
            </section>

            {/* Phần Câu Chuyện */}
            <section className="py-20 px-4 bg-gray-100">
                <h2 className="text-3xl text-center font-bold mb-10">
                    Những Câu Chuyện Truyền Cảm Hứng
                </h2>
                <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    <div className="story-card bg-white rounded-lg shadow-md p-5">
                        <h3 className="text-xl font-semibold">
                            Khởi Đầu SPhoneC
                        </h3>
                        <p className="mt-2 text-gray-600">
                            Từ ý tưởng về một cửa hàng thời trang uy tín năm
                            2020, chúng tôi đã không ngừng phát triển để trở
                            thành điểm đến tin cậy cho tín đồ thời trang.
                        </p>
                    </div>

                    <div className="story-card bg-white rounded-lg shadow-md p-5">
                        <h3 className="text-xl font-semibold">
                            Cam Kết Chất Lượng
                        </h3>
                        <p className="mt-2 text-gray-600">
                            Mỗi sản phẩm tại SPhoneC đều được kiểm tra kỹ lưỡng
                            và đảm bảo chính hãng. Chúng tôi tự hào về độ tin
                            cậy và sự hài lòng của khách hàng.
                        </p>
                    </div>

                    <div className="story-card bg-white rounded-lg shadow-md p-5">
                        <h3 className="text-xl font-semibold">
                            Dịch Vụ Khách Hàng
                        </h3>
                        <p className="mt-2 text-gray-600">
                            Đội ngũ tư vấn chuyên nghiệp của chúng tôi luôn sẵn
                            sàng hỗ trợ 24/7, giúp khách hàng tìm được sản phẩm
                            phù hợp nhất với nhu cầu.
                        </p>
                    </div>

                    <div className="story-card bg-white rounded-lg shadow-md p-5">
                        <h3 className="text-xl font-semibold">
                            Trải Nghiệm Mua Sắm
                        </h3>
                        <p className="mt-2 text-gray-600">
                            Với showroom hiện đại và website thân thiện, chúng
                            tôi mang đến trải nghiệm mua sắm thuận tiện và dễ
                            dàng cho khách hàng.
                        </p>
                    </div>

                    <div className="story-card bg-white rounded-lg shadow-md p-5">
                        <h3 className="text-xl font-semibold">
                            Chính Sách Bảo Hành
                        </h3>
                        <p className="mt-2 text-gray-600">
                            Chế độ bảo hành dài hạn và chính sách đổi trả linh
                            hoạt giúp khách hàng hoàn toàn yên tâm khi mua sắm
                            tại GOSY Store.
                        </p>
                    </div>

                    <div className="story-card bg-white rounded-lg shadow-md p-5">
                        <h3 className="text-xl font-semibold">
                            Tương Lai Phát Triển
                        </h3>
                        <p className="mt-2 text-gray-600">
                            Chúng tôi không ngừng mở rộng và cải tiến, với mục
                            tiêu trở thành chuỗi cửa hàng thời trang hàng đầu
                            tại Việt Nam.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Stories;

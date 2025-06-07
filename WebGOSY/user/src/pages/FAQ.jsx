import { useState, useEffect } from "react";

const FaQ = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const [activeIndex, setActiveIndex] = useState(null);

    const faqs = [
        {
            question: "Chính sách đổi trả của GOSY như thế nào?",
            answer: "Quý khách có thể đổi trả sản phẩm trong vòng 30 ngày kể từ ngày mua hàng với điều kiện sản phẩm còn nguyên vẹn, đầy đủ phụ kiện và hộp. Đối với sản phẩm lỗi do nhà sản xuất, chúng tôi sẽ đổi mới 100% trong 15 ngày đầu tiên.",
        },
        {
            question: "Thời gian giao hàng mất bao lâu?",
            answer: "Thời gian giao hàng thông thường từ 1-3 ngày đối với khu vực nội thành TP.HCM và 3-5 ngày đối với các tỉnh thành khác. Đơn hàng trên 10 triệu được miễn phí giao hàng toàn quốc.",
        },
        {
            question: "Chính sách bảo hành như thế nào?",
            answer: "Tất cả sản phẩm tại GOSY được bảo hành chính hãng 2 tháng. Ngoài ra, khách hàng được hưởng thêm 1 tháng bảo hành từ cửa hàng. Chúng tôi có trung tâm bảo hành riêng để phục vụ khách hàng nhanh chóng.",
        },
        {
            question: "Làm thế nào để liên hệ với bộ phận hỗ trợ?",
            answer: "Quý khách có thể liên hệ với chúng tôi qua email gosysote@gmail.com hoặc gọi số hotline 0947500422. Đội ngũ CSKH của chúng tôi làm việc từ 8h00 - 22h00 hàng ngày, kể cả ngày lễ.",
        },
        {
            question: "GOSY có chương trình khách hàng thân thiết không?",
            answer: "Có, chúng tôi có chương trình tích điểm cho khách hàng thân thiết.Khi mua hàng, các bạn sẽ nhận điểm tích lũy thành viên, có thể sử dụng khuyến mãi khi mua hàng.",
        },
        {
            question: "Làm sao để biết sản phẩm tại GOSY là chính hãng?",
            answer: "Tất cả sản phẩm tại GOSY đều có tem bảo hành chính hãng và có thể check IMEI trực tiếp trên website của nhà sản xuất. Chúng tôi cam kết 100% sản phẩm chính hãng, hoàn tiền gấp 10 lần nếu phát hiện hàng giả.",
        },
    ];

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <main className="main">
          
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
                    <h1 className="text-5xl font-bold">Câu Hỏi Thường Gặp</h1>
                    <p className="mt-4 text-xl">
                        Tìm câu trả lời cho những thắc mắc phổ biến.
                    </p>
                </div>
            </section>

            {/* Phần FAQ */}
            <section className="faq-section mt-10 max-w-3xl mx-auto pb-20">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className="faq-item bg-white rounded-lg shadow-md my-2"
                    >
                        <div
                            className="faq-question p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                            onClick={() => toggleFAQ(index)}
                        >
                            <h3 className="text-xl font-semibold">
                                {faq.question}
                            </h3>
                            <span className="text-2xl">
                                {activeIndex === index ? "-" : "+"}
                            </span>
                        </div>
                        {activeIndex === index && (
                            <div className="faq-answer p-4 border-t">
                                <p className="text-gray-600">{faq.answer}</p>
                            </div>
                        )}
                    </div>
                ))}
            </section>
        </main>
    );
};

export default FaQ;

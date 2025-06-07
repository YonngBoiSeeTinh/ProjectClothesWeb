import React, { useEffect } from 'react';

const Terms = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <main className="main">
            {/* Phần Hero */}
            <section className="hero-section h-96 flex items-center justify-center text-center text-white"
                style={{
                    background: "linear-gradient(to bottom, rgba(30, 58, 138, 0.8), rgba(30, 58, 138, 0.8)), url('/path-to-your-background-image.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}>
                <div className="bg-black bg-opacity-70 p-10 rounded-lg shadow-lg">
                    <h1 className="text-5xl font-bold">Điều Khoản & Điều Kiện</h1>
                    <p className="mt-4 text-xl">Hiểu rõ quyền lợi và trách nhiệm của bạn.</p>
                </div>
            </section>

            {/* Phần Nội Dung Điều Khoản */}
            <section className="terms-section max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 mt-10">
                <h2 className="text-4xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2">1. Giới Thiệu</h2>
                <p className="mt-4 text-gray-600">
                    Chào mừng đến với website của chúng tôi. Khi sử dụng trang web này, bạn đồng ý tuân thủ các điều khoản và điều kiện sau. Vui lòng đọc kỹ.
                </p>

                <h2 className="text-4xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mt-6">2. Chấp Nhận Điều Khoản</h2>
                <p className="mt-4 text-gray-600">
                    Việc truy cập và sử dụng website phụ thuộc vào việc bạn chấp nhận và tuân thủ các điều khoản này. Nếu không đồng ý với bất kỳ phần nào, bạn không nên truy cập trang web.
                </p>

                <h2 className="text-4xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mt-6">3. Thay Đổi Điều Khoản</h2>
                <p className="mt-4 text-gray-600">
                    Chúng tôi có quyền thay đổi các điều khoản này bất cứ lúc nào. Việc bạn tiếp tục sử dụng website đồng nghĩa với việc chấp nhận các điều khoản đã được sửa đổi.
                </p>

                <h2 className="text-4xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mt-6">4. Trách Nhiệm Người Dùng</h2>
                <p className="mt-4 text-gray-600">
                    Người dùng có trách nhiệm đảm bảo việc sử dụng trang web tuân thủ các quy định và luật pháp hiện hành.
                </p>

                <h2 className="text-4xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mt-6">5. Giới Hạn Trách Nhiệm</h2>
                <p className="mt-4 text-gray-600">
                    Chúng tôi không chịu trách nhiệm về bất kỳ tổn thất hoặc thiệt hại gián tiếp nào phát sinh từ việc sử dụng trang web của chúng tôi.
                </p>

                <h2 className="text-4xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mt-6">6. Luật Điều Chỉnh</h2>
                <p className="mt-4 text-gray-600">
                    Các điều khoản này được điều chỉnh và giải thích theo pháp luật Việt Nam.
                </p>

                <h2 className="text-4xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mt-6">7. Liên Hệ</h2>
                <p className="mt-4 text-gray-600">
                    Nếu bạn có bất kỳ câu hỏi nào về các Điều Khoản này, vui lòng liên hệ với chúng tôi qua email: <a href="mailto:gosytore@gmail.com" className="text-blue-600 underline">gosytore@gmail.com</a>
                </p>
            </section>
        </main>
    );
};

export default Terms;

import React, { useEffect } from 'react';

const ContactUs = () => {
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
                    <h1 className="text-5xl font-bold">Liên Hệ Với Chúng Tôi</h1>
                    <p className="mt-4 text-xl">Chúng tôi luôn sẵn sàng hỗ trợ và giải đáp mọi thắc mắc của bạn!</p>
                </div>
            </section>

            {/* Phần Thông Tin Liên Hệ */}
            <section className="info-section mt-10 max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-bold">Thông Tin Liên Hệ</h2>
                <p className="mt-4">Hãy liên hệ với chúng tôi qua email hoặc điện thoại, chúng tôi sẽ phản hồi trong thời gian sớm nhất.</p>

                <div className="mt-6">
                    <p className="text-xl">Email: <a href="mailto:sphonec@gmail.com" className="text-blue-600">sphonec@gmail.com</a></p>
                    <p className="mt-4 text-xl">Điện thoại: <a href="tel:+84947500422" className="text-blue-600">(+84) 947500422</a></p>
                    <p className="mt-4 text-xl">Địa chỉ: Sư Vạn Hạnh, TP. Hồ Chí Minh</p>
                </div>
            </section>

            {/* Phần Tương Tác */}
            <section className="interactive-section py-20 bg-gray-100">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-8">Chúng Tôi Rất Mong Nhận Được Phản Hồi Từ Bạn!</h2>
                    <p className="text-lg">Dù bạn có thắc mắc hay cần hỗ trợ, đừng ngần ngại liên hệ với chúng tôi. Mọi phản hồi và câu hỏi của bạn đều rất quan trọng đối với chúng tôi.</p>
                </div>
            </section>
        </main>
    );
};

export default ContactUs;

import React, { useEffect } from 'react';

const PrivacyPolicy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <main className="bg-gray-100 py-12 px-6">
            <section className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-4xl font-bold mb-6">Chính Sách Bảo Mật</h1>
                <p className="text-gray-700 mb-4">
                    Quyền riêng tư của bạn rất quan trọng với chúng tôi. Chính sách này nêu rõ những thông tin cá nhân chúng tôi thu thập và cách chúng tôi sử dụng chúng.
                </p>
                
                <h2 className="text-2xl font-semibold mt-6 mb-3">1. Thông Tin Thu Thập</h2>
                <p className="text-gray-600 mb-4">
                    Chúng tôi thu thập thông tin mà bạn trực tiếp cung cấp cho chúng tôi khi tạo tài khoản, mua hàng hoặc liên hệ với chúng tôi.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-3">2. Cách Sử Dụng Thông Tin</h2>
                <p className="text-gray-600 mb-4">
                    Chúng tôi sử dụng thông tin thu thập được để cung cấp và cải thiện dịch vụ, liên lạc với bạn và bảo vệ dịch vụ của chúng tôi.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-3">3. Bảo Mật Dữ Liệu</h2>
                <p className="text-gray-600 mb-4">
                    Chúng tôi áp dụng các biện pháp hợp lý để bảo vệ thông tin của bạn khỏi truy cập và tiết lộ trái phép.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-3">4. Thay Đổi Chính Sách</h2>
                <p className="text-gray-600 mb-4">
                    Chúng tôi có thể cập nhật chính sách bảo mật này theo thời gian. Chúng tôi sẽ thông báo cho bạn về những thay đổi quan trọng.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-3">5. Liên Hệ</h2>
                <p className="text-gray-600 mb-4">
                    Nếu bạn có bất kỳ câu hỏi nào về Chính Sách Bảo Mật này, vui lòng liên hệ với chúng tôi qua email: sphonec@gmail.com
                </p>
            </section>
        </main>
    );
};

export default PrivacyPolicy;

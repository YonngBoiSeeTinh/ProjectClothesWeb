import React, { useEffect } from 'react';

const Vacancies = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <main className="main">
            {/* Phần Hero */}
            <section className="hero-section h-96 flex items-center justify-center text-center text-white" style={{ background: "linear-gradient(to bottom, rgba(30, 58, 138, 0.8), rgba(30, 58, 138, 0.8)), url('/path-to-your-background-image.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="bg-black bg-opacity-70 p-10 rounded-lg shadow-lg">
                    <h1 className="text-5xl font-bold">Cơ Hội Nghề Nghiệp</h1>
                    <p className="mt-4 text-xl">Khám phá các vị trí tuyển dụng và trở thành một phần của chúng tôi.</p>
                </div>
            </section>

            {/* Phần Tuyển Dụng */}
            <section className="py-20 px-4 bg-gray-100">
                <h2 className="text-3xl text-center font-bold mb-10">Vị Trí Đang Tuyển</h2>
                <div className="container grid mx-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justity-center">
                    <div className="vacancy-card bg-white rounded-lg shadow-md p-5">
                        <h3 className="text-xl font-semibold">Nhân Viên Bán Hàng</h3>
                        <p className="mt-2 text-gray-600">Địa điểm: Sư Vạn Hạnh, TP.HCM</p>
                        <p className="mt-2">Chúng tôi đang tìm kiếm nhân viên bán hàng nhiệt tình, có kiến thức về thời trang. Ưu tiên có kinh nghiệm bán hàng.</p>
                        <p className="mt-2">Gửi CV về email: <a href="mailto:gosystore@gmail.com" className="text-blue-600">gosystore@gmail.com</a></p>
                    </div>

                    <div className="vacancy-card bg-white rounded-lg shadow-md p-5">
                        <h3 className="text-xl font-semibold">Chuyên Viên Marketing</h3>
                        <p className="mt-2 text-gray-600">Địa điểm: Làm việc từ xa</p>
                        <p className="mt-2">Cần tuyển chuyên viên marketing có kinh nghiệm digital marketing, quản lý mạng xã hội và tạo nội dung.</p>
                        <p className="mt-2">Ứng tuyển qua email: <a href="mailto:gosystore@gmail.com" className="text-blue-600">gosystore@gmail.com</a></p>
                    </div>

                    <div className="vacancy-card bg-white rounded-lg shadow-md p-5">
                        <h3 className="text-xl font-semibold">Nhân Viên Kho</h3>
                        <p className="mt-2 text-gray-600">Địa điểm: Sư Vạn Hạnh, TP.HCM</p>
                        <p className="mt-2">Tuyển nhân viên kho có kinh nghiệm quản lý hàng hóa, kiểm kê và đóng gói sản phẩm thời trang.</p>
                        <p className="mt-2">Gửi CV về: <a href="mailto:gosystore@gmail.com" className="text-blue-600">gosystore@gmail.com</a></p>
                    </div>

                    <div className="vacancy-card bg-white rounded-lg shadow-md p-5">
                        <h3 className="text-xl font-semibold">Chăm Sóc Khách Hàng</h3>
                        <p className="mt-2 text-gray-600">Địa điểm: Sư Vạn Hạnh, TP.HCM</p>
                        <p className="mt-2">Tìm kiếm nhân viên CSKH có kỹ năng giao tiếp tốt, kiên nhẫn và am hiểu về thời trang.</p>
                        <p className="mt-2">Liên hệ: <a href="mailto:gosystore@gmail.com" className="text-blue-600">gosystore@gmail.com</a></p>
                    </div>

                    <div className="vacancy-card bg-white rounded-lg shadow-md p-5">
                        <h3 className="text-xl font-semibold">Quản Lý Cửa Hàng</h3>
                        <p className="mt-2 text-gray-600">Địa điểm: Sư Vạn Hạnh, TP.HCM</p>
                        <p className="mt-2">Cần tuyển quản lý có kinh nghiệm điều hành cửa hàng thời trang, quản lý nhân sự và phát triển kinh doanh.</p>
                        <p className="mt-2">Ứng tuyển: <a href="mailto:gosystore@gmail.com" className="text-blue-600">gosystore@gmail.com</a></p>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Vacancies;


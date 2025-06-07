import Heading from "../../shared/Heading";

import Img1 from "../../assets/fakeAssets/blogs/new1.jpg";
import Img2 from "../../assets/fakeAssets/blogs/new3.jpg";
import Img3 from "../../assets/fakeAssets/blogs/new2.webp";

const BlogData = [
    {
        id: 1,
        title: "Top 9 xu hướng thời trang hot nhất mùa Thu Đông 2024",
        subtitle:
            "Cơn sốt dép nhựa manh nha từ năm 2022. Năm ngoái, hãng The Row khiến mốt này trở nên hot hơn nhờ ra mắt mẫu giày lưới màu đỏ 900 USD (22,8 triệu đồng) trong show Pre-Fall 2024, với thông điệp hồi tưởng khoảnh khắc thời thơ ấu. Ảnh: SDM.",
        publisher: "bời Tùng Lâm",
        image: Img1,
        aosDelay: "200",
        link: "https://www.elle.vn/the-gioi-thoi-trang/nu-lanh-dao-thoi-trang-8-3/",
    },
    {
        id: 2,
        title: "Top 10 xu hướng Xuân Hè 2025 đáng chú ý nhất từ tứ đại tuần lễ thời trang",
        subtitle:
            "Bắt nhịp những xu hướng thời trang hè 2024 đang thống lĩnh trên các sàn diễn thời trang, đó là những item đầy phóng khoáng thay vì tập trung vào các item tối giản, xu hướng mùa hè 2024 xoay quanh những món đồ có kiểu dáng và hoạt tiết khá điệu đà, nổi bật từ đó giúp style thêm ấn tượng. Hãy cùng điểm danh những xu hướng thời trang nữ xuân hè 2024 nổi bật cùng nhà MARC nhé.",
        publisher: "bởi Quang Cao",
        image: Img2,
        aosDelay: "400",
        link: "https://bazaarvietnam.vn/top-xu-huong-thoi-trang-xuan-he-2025/",
    },
    {
        id: 3,
        title: "8 “nữ lãnh đạo” trong thời trang: Phụ nữ đã thay đổi thế giới như thế nào?",
        subtitle:
            "hành công của một người phụ nữ không chỉ là thành tựu cá nhân mà còn mở ra cánh cửa cho nhiều thế hệ tiếp theo. Từ Coco Chanel, Elsa Schiaparelli cho đến những tên tuổi hiện đại như Maria Grazia Chiuri hay Phoebe Philo, mỗi người trong số họ đều mang đến một dấu ấn riêng biệt.",
        publisher: "bởi The Heloo Kitty",
        image: Img3,
        aosDelay: "600",
        link: "https://www.elle.vn/the-gioi-thoi-trang/nu-lanh-dao-thoi-trang-8-3/",
    },
];

const Blogs = () => {
    return (
        <div className="my-12">
            <div className="container">
                {/* Phần tiêu đề */}
                <Heading title="Tin Tức Mới Nhất" subtitle="" />

                {/* Phần blog */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 gap-y-8 sm:gap-4 md:gap-7">
                    {/* Thẻ blog */}
                    {BlogData.map((item) => (
                        <a href={item.link}>
                             <div
                            key={item.id}
                            className="bg-white dark:bg-gray-900"
                            data-aos="fade-up"
                            data-aos-duration="500"
                            data-aos-anchor-placement="bottom-bottom"
                            data-aos-once={false}
                            data-aos-delay={item.aosDelay}
                        >
                            {/* Phần hình ảnh */}
                            <div className="overflow-hidden rounded-2xl mb-2">
                                <img
                                    src={item.image}
                                    alt=""
                                    className="w-full h-[220px] object-cover rounded-2xl hover:scale-[1.1] ease-linear transition-transform duration-150"
                                />
                            </div>
                            {/* Phần nội dung */}
                            <div className="space-y-2">
                                <p className="text-xs text-gray-500">
                                    {item.publisher}
                                </p>
                                <p className="font-bold line-clamp-1">
                                    {item.title}
                                </p>
                                <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                                    {item.subtitle}
                                </p>
                            </div>
                        </div>
                        </a>
                       
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Blogs;

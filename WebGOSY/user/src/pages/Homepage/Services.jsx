import {
    CustomerServiceOutlined,
    SafetyOutlined,
    TruckOutlined,
    WalletOutlined,
} from "@ant-design/icons";

const ServiceData = [
    {
        id: 1,
        icon: <TruckOutlined className="text-4xl md:text-5xl text-primary" />,
        title: "Miễn Phí Vận Chuyển",
        description: "Miễn phí vận chuyển cho đơn hàng trên 7.000.000 VND",
        aosDelay: '0'
    },
    {
        id: 2,
        icon: <WalletOutlined className="text-4xl md:text-5xl text-primary" />,
        title: "Hoàn Tiền An Toàn",
        description: "Đảm bảo hoàn tiền trong vòng 30 ngày",
        aosDelay: '200'
    },
    {
        id: 3,
        icon: <SafetyOutlined className="text-4xl md:text-5xl text-primary" />,
        title: "Thanh Toán An Toàn",
        description: "Tất cả thanh toán đều được bảo mật",
        aosDelay: '400'
    },
    {
        id: 4,
        icon: (
            <CustomerServiceOutlined className="text-4xl md:text-5xl text-primary" />
        ),
        title: "Hỗ Trợ 24/7",
        description: "Hỗ trợ kỹ thuật 24/7",
        aosDelay: '600'
    },
];

const Services = () => {
    return (
        <div className="container my-14 md:my-20 2xl:translate-x-14 xl:translate-x-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 gap-y-8">
                {ServiceData.map((service) => (
                    <div
                        key={service.id}
                        className="flex flex-col items-start sm:flex-row gap-4"
                        data-aos="fade-up"
                        data-aos-duration="500"
                        data-aos-delay={service.aosDelay}
                        data-aos-anchor-placement="bottom-bottom"
                    >
                        {service.icon}
                        <div>
                            <h1 className="lg:text-xl font-bold">
                                {service.title}
                            </h1>
                            <h1 className="text-gray-400 text-sm">
                                {service.description}
                            </h1>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Services;

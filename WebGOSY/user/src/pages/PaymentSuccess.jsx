import PathNames from "../PathNames.js";
import { useNavigate } from "react-router";

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const handleToPurchasePage = () => {
        navigate(PathNames.MY_ORDERS);
    };
    const handleToHomePage = () => {
        navigate(`/`);
    };
     
    
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-green-50">
            <h1 className="text-4xl font-bold text-green-600 mb-4">
                Thanh toán thành công!
            </h1>
            <p className="text-lg text-gray-700 mb-6">
                Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.
            </p>
            <div className="flex space-x-4">
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={handleToPurchasePage}
                >
                    Xem lịch sử mua hàng
                </button>
                <button
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                    onClick={handleToHomePage}
                >
                    Quay về trang chủ
                </button>
            </div>
        </div>
    );
};

export default PaymentSuccess;

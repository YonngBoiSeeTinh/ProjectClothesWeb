import Heading from "../../shared/Heading";
import { API_URL } from "../../config.js";
import axios from "axios";
import { useEffect, useState } from "react";

const Blogs = ({post}) => {
    
    return (
        <div className="my-12">
            <div className="container">
                {/* Phần tiêu đề */}
                <Heading title="Tin Tức Mới Nhất" subtitle="" />

                {/* Phần blog */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 gap-y-8 sm:gap-4 md:gap-7">
                    {/* Thẻ blog */}
                    {post.map((item) => (
                        <a href={item.content}>
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
                                    src={`data:image/jpeg;base64,${item.image}`}
                                    alt=""
                                    className="w-full h-[220px] object-cover rounded-2xl hover:scale-[1.1] ease-linear transition-transform duration-150"
                                />
                            </div>
                            {/* Phần nội dung */}
                            <div className="space-y-2">
                                <p className="text-xs text-gray-500">
                                    {item.authur}
                                </p>
                                <p className="font-bold line-clamp-1">
                                    {item.title}
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

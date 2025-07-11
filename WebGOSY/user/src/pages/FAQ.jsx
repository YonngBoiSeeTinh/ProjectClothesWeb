import React from 'react';
import { useEffect, useState } from "react";
import { API_URL } from "../config.js";
import axios from "axios";
const FaQ = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const [activeIndex, setActiveIndex] = useState(null);

 

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };
    const [faqs, setFaqs] = useState([]);
    
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/Posts`);
                const post = response.data
                setFaqs(post.filter(p=>p.type == "Câu hỏi"));
            } catch (error) {
                console.error("Lỗi khi tải posts:", error);
            }
        };
        
        fetchPosts();
        
    }, []);
    
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
                                {faq.title}
                            </h3>
                            <span className="text-2xl">
                                {activeIndex === index ? "-" : "+"}
                            </span>
                        </div>
                        {activeIndex === index && (
                            <div className="faq-answer p-4 border-t">
                                <p className="text-gray-600">{faq.content}</p>
                            </div>
                        )}
                    </div>
                ))}
            </section>
        </main>
    );
};

export default FaQ;

import { faStar as farStar } from "@fortawesome/free-regular-svg-icons";
import axios from "axios";
import { Rate } from "antd";
import {
    faStar,
    faStarHalfAlt
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import PropTypes from "prop-types";
import { Fragment, useState, useEffect } from "react";
import { API_URL } from "../../config";

const Rating = ({ rating, showLabel, className, ...rest }) => (
	<p className={classNames("text-sm", className)} {...rest}>
		<span className="text-yellow-500">
			{[...Array(5)].map((_, i) => {
				const index = i + 1;
				let content = "";
				if (index <= Math.floor(rating))
					content = <FontAwesomeIcon icon={faStar} />;
				else if (rating > i && rating < index + 1)
					content = <FontAwesomeIcon icon={faStarHalfAlt} />;
				else if (index > rating) content = <FontAwesomeIcon icon={farStar} />;

				return <Fragment key={i}>{content}</Fragment>;
			})}
		</span>
		{showLabel && <span className="mx-1">{rating.toFixed(1)}</span>}
	</p>
);

Rating.propTypes = {
	rating: PropTypes.number.isRequired,
	showLabel: PropTypes.bool,
	className: PropTypes.string,
};

const ReviewItem = ({ item }) => {
    const createdAt = item.createdAt
    const formattedDate = new Date(createdAt).toLocaleDateString("vi-VN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    const imageUrl = item.image_base64
        ? `data:image/jpeg;base64,${item.image_base64}`
        : "https://cdn.easyfrontend.com/pictures/users/user1.jpg";

	return (
		<>
			<hr className="dark:border-slate-700 my-5" />
			<div>
				<div className="flex items-center mb-6">
					<div className="w-12 h-12 rounded-full mr-2 overflow-hidden">
						<img src={imageUrl} alt={item.name} className="max-w-full h-auto mx-auto" />
					</div>
					<div className="flex flex-grow justify-between">
						<div>
							<h5 className="font-medium mb-1">{item.name}</h5>
							<Rating rating={item.stars} showLabel={true} />
						</div>
						<p className="text-sm opacity-50 mb-0">{formattedDate}</p>
					</div>
				</div>
				<p className="text-sm leading-normal opacity-75 mb-6">{item.content}</p>
			</div>
		</>
	);
};

ReviewItem.propTypes = {
	item: PropTypes.object.isRequired,
};

export const ReviewsSection = ({productid}) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/Comments/ProductComment/${productid}`);
				console.log('productid',productid);
                setComments(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching comments:", error);
                setLoading(false);
            }
        };
        fetchComments();
    }, []);

    const averageRating =
        comments.length > 0
            ? comments.reduce((sum, comment) => sum + comment.stars, 0) / comments.length
            : 0;


	return (
		<section className="py-14 md:py-24 w-[100%] bg-white dark:bg-[#0b1727] text-zinc-900 dark:text-white relative overflow-hidden z-10 ">
			<div className="container px-4 mx-auto ">
				<div className="container px-4 justity-center w-full md:w-4/5 min-w-[400px] max-w-[1200px]">
					<div className="shadow-md dark:bg-slate-800 rounded p-4 lg:p-8 bg-gray-50">
						<div>
							<div className="p-3 md:p-6">
								<div className="flex flex-wrap items-center">
									<span className="text-[40px]">4.5</span>
									<Rating
										rating={averageRating}
										showLabel={false}
										className="text-yellow-500 ml-2"
									/>
								</div>
								<p className="text-sm opacity-75 mb-6">
									Average rating based on {comments.length} reviews
								</p>
							</div>
							<hr className="dark:border-slate-700 my-4" />
							<div className="p-3 pt-0 md:p-6 md:pt-0">
								<div className="flex justify-between items-center">
									<h2 className="text-2xl font-medium">Customer Review</h2>
								</div>
                                {loading ? (
                                    <p>Loading reviews...</p>
                                ) : comments.length > 0 ? (
                                    comments.map((item, i) => (
                                        <ReviewItem item={item} key={i} />
                                    ))
                                ) : (
                                    <p>Chưa có bình luận về sản phẩm</p>
                                )}
							</div>
							<div className="py-6 lg:py-12 text-center">
								<button className="bg-blue-600 text-white text-sm hover:bg-opacity-90 rounded py-2.5 px-6 md:px-10">
									Load More
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};


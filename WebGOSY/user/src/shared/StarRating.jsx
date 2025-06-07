// import { useState } from "react";

// const StarRating = ({ initialRating = 0, onRatingChange }) => {
//     const [rating, setRating] = useState(initialRating);
//     const [hover, setHover] = useState(0);

//     const handleClick = (value) => {
//         setRating(value);
//         if (onRatingChange) {
//             onRatingChange(value);
//         }
//     };

//     return (
//         <div className="flex flex-row-reverse justify-end ">
//             {[...Array(5)].map((_, index) => {
//                 const value = 5 - index;
//                 return (
//                     <button
//                         key={value}
//                         type="button"
//                         onClick={() => handleClick(value)}
//                         onMouseEnter={() => setHover(value)}
//                         onMouseLeave={() => setHover(0)}
//                         className="bg-transparent border-none p-0 cursor-pointer text-3xl leading-tight focus:outline-none"
//                         style={{
//                             color:
//                                 (hover || rating) >= value ? "#ffa723" : "#666",
//                             transition: "color 200ms",
//                         }}
//                         aria-label={`Rate ${value} stars out of 5`}
//                     >
//                         ★
//                     </button>
//                 );
//             })}
//         </div>
//     );
// };

// export default StarRating;

// import { useState } from "react";
// import styled from "styled-components";

// const StarRating = ({ rating, onRatingChange }) => {
//     const [currentRating, setCurrentRating] = useState(rating);

//     const handleRatingChange = (newRating) => {
//         setCurrentRating(newRating);
//         onRatingChange(newRating); // Trigger the callback
//     };

//     return (
//         <StyledWrapper>
//             <div className="rating">
//             {[...Array(5)].map((_, index) => (
//                 <label key={index}>
//                     <input
//                         type="radio"
//                         name="rating"
//                         value={5 - index}
//                         checked={currentRating === 5 - index}
//                         onChange={() => handleRatingChange(5 - index)}
//                     />
//                 </label>
//             ))}
//         </div>
//         </StyledWrapper>
//     );
// };

// const StyledWrapper = styled.div`
//     .rating:not(:checked) > input {
//         position: absolute;
//         appearance: none;
//     }

//     .rating:not(:checked) > label {
//         float: right;
//         cursor: pointer;
//         font-size: 30px;
//         color: #666;
//     }

//     .rating:not(:checked) > label:before {
//         content: "★";
//     }

//     .rating > input:checked + label:hover,
//     .rating > input:checked + label:hover ~ label,
//     .rating > input:checked ~ label:hover,
//     .rating > input:checked ~ label:hover ~ label,
//     .rating > label:hover ~ input:checked ~ label {
//         color: #e58e09;
//     }

//     .rating:not(:checked) > label:hover,
//     .rating:not(:checked) > label:hover ~ label {
//         color: #ff9e0b;
//     }

//     .rating > input:checked ~ label {
//         color: #ffa723;
//     }
// `;

// export default StarRating;

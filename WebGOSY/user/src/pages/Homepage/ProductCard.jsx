

// const ProductCard = ({ data }) => {
//     return (
//         <div className="mb-10">
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 place-items-center">
//                 {/* card selection */}
//                 {data.map((item) => (
//                     <div key={item.id} className="productcard-item group">
//                         <div className="productcard-img relative">
//                             <img
//                                 src={item.image}
//                                 alt=""
//                                 className="h-[180px] w-[260px] object-cover rounded-xl mb-3"
//                             />
//                             {/* hover button */}
//                             <div className="hidden group-hover:flex absolute top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2 h-full w-full text-center group-hover:backdrop-blur-sm justify-center items-center duration-200">
//                                 <PlusCircleOutlined className="text-primary text-5xl hover:-translate-y-1 active:scale-75 active:translate-y-1 transform transition-transform duration-75 ease-linear"/>
//                             </div>
//                         </div>
//                         <div className="leading-7">
//                             <h2 className="text-lg font-semibold">
//                                 {item.title}
//                             </h2>
//                             <h2 className="text-sm text-gray-500 font-bold">
//                                 ${item.price}
//                             </h2>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default ProductCard;

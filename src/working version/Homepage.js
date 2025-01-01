import {Link} from "react-router-dom";
import Rating from "@mui/material/Rating";
import React from "react";

<div className="w-full mt-14 px-[100px] bg-white rounded-xl ">
    <ul className="w-full flex flex-wrap gap-x-2 justify-center gap-y-2">
        {products.map((product) => (
            <Link onClick={()=> {trackViewBehavior(product.productID)}} to={`/product/${product.productID}`}
                  className="w-64 border border-gray-200" key={product._id}>
                <div className="w-full h-[200px] bg-gray-200 rounded-[20px]">
                    <img
                        src={product.image[0]} // Displaying the first image from the image array
                        alt="Product Image"
                        className="w-full h-full object-cover rounded-t-[20px]"
                    />
                </div>
                <div className="flex flex-col mt-4 px-2">
                    <span className="font-bold text-base hover:underline">{product.name}</span>
                    <Rating
                        name="half-rating-read"
                        defaultValue={2.5}
                        precision={0.5}
                        readOnly
                    />
                    <span className="font-bold text-xl">${product.price}</span>
                </div>
            </Link>
        ))}

    </ul>
</div>
import PropTypes from "prop-types";
import { Card } from "@mui/material";
import {Link} from "react-router-dom";

const ProductCard = ({ product }) => {
    const {
        _id,
        name,
        price,
        category,
        image, // Assuming `image` is the primary image
        productImage = [], // Fallback in case productImage array is empty
    } = product;

    // Fallback for image src if `productImage` array is empty
    const imgSrc = image || productImage[0] || "path/to/fallback/image.jpg"; // Default fallback image

    return (
        <Link to={`/product/${_id}`}>
            <Card className="flex-shrink-0 w-72 rounded-md overflow-hidden hover:border-black mb-2 shadow-none">
            {/* Product Image */}
            <div className="relative aspect-square flex items-center justify-center bg-gray-100">
                <picture>
                    {productImage && productImage.length > 0 ? (
                        productImage.map((src, index) => (
                            <source
                                key={index}
                                srcSet={src}
                                media="(min-width: 600px)"
                                width="1050"
                                height="1400"
                            />
                        ))
                    ) : (
                        <source srcSet={imgSrc} />
                    )}
                    <img
                        src={imgSrc}
                        alt={name}
                        className="object-cover h-full w-full"
                        loading="lazy"
                        fetchPriority="auto"
                        width="1050"
                        height="1400"
                    />
                </picture>
            </div>

            {/* Product Content */}
            <div className="p-1 px-3 text-left flex flex-col space-y-1">

                <span className="text-base font-medium truncate">{price.toLocaleString()}₫</span>
                <span className="text-base text-gray-800 font-bold truncate">{name}</span>
                <span className="text-sm text-gray-500">{category}</span>
            </div>
        </Card>
        </Link>
    );
};

// PropTypes validation to ensure proper props are passed
ProductCard.propTypes = {
    product: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
        subcategory: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        brand: PropTypes.string.isRequired,
        sport: PropTypes.string,
        price: PropTypes.number.isRequired,
        image: PropTypes.string.isRequired,
        productImage: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
};

export default ProductCard;
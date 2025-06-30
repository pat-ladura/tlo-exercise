"use client";
import React from "react";

interface Props {
  product: any;
}

const ProductItem: React.FC<Props> = ({ product }) => {
  return (
    <div
      key={product.id}
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
    >
      <img
        src={product.thumbnailImageUrl}
        alt={product.name}
        className="w-full h-48 object-cover rounded-md mb-4"
      />
      <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
      <span className="text-sm mb-2 flex">Brand: {product.brand}</span>
      <span className="text-xl font-bold text-blue-600">${product.price}</span>
    </div>
  );
};

export default ProductItem;

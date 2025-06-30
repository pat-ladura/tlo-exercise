import ProductsLayout from "@/components/products/products-layout";
import React from "react";

export default function Home() {
  return (
    <div className="items-center justify-items-center">
      <div className="container">
        <ProductsLayout />
      </div>
      <footer></footer>
    </div>
  );
}

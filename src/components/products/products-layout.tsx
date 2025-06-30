"use client";
import fetcher from "@/lib/fetcher";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import DualRangeSlider from "../ui/dual-range-slider";

const ProductsLayout: React.FC = () => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const brandsParam = searchParams.get("brands") || "";
  const minParam = searchParams.get("min") || 0;
  const maxParam = searchParams.get("max") || 5000;
  const sortParam = searchParams.get("sort") || "";

  const [search, setSearch] = useState<string>(query);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [brands, setBrands] = useState<any[]>([]);
  const [sort, setSort] = useState<string>("");

  async function fetchProductList() {
    setLoading(true);
    const response = await fetcher(
      `/api/products?q=${query}&brands=${brandsParam}&min=${minParam}&max=${maxParam}&sort=${sortParam}`
    );
    if (response.ok) {
      const data = response.data;
      setProducts(data.results);

      const checkedBrands = brandsParam.split(",").filter(Boolean);
      const brs = Array.from(
        new Set(
          data.brands.map((product: any) => product.brand).filter(Boolean)
        )
      ).map((brand: any) => ({
        name: brand,
        selected: checkedBrands.includes(brand),
      }));
      setBrands(brs);
    } else {
    }
    setLoading(false);
  }

  function updateSearchParams({
    q,
    brands,
    min,
    max,
    sort,
  }: {
    q?: string;
    brands?: string[];
    min?: number;
    max?: number;
    sort?: string;
  }) {
    const params = new URLSearchParams(window.location.search);
    if (q !== undefined) params.set("q", q.trim());
    if (brands !== undefined) {
      if (brands.length > 0) {
        params.set("brands", brands.join(","));
      } else {
        params.delete("brands");
      }
    }
    if (min !== undefined) {
      params.set("min", min.toString());
    } else {
      params.delete("min");
    }
    if (max !== undefined) {
      params.set("max", max.toString());
    } else {
      params.delete("max");
    }
    if (sort !== undefined && sort !== "") {
      params.set("sort", sort);
    } else {
      params.delete("sort");
    }
    setTimeout(() => {
      router.push(`/?${params.toString()}`);
    }, 0);
  }

  function searchProducts() {
    updateSearchParams({
      q: search,
      brands: brands.filter((b: any) => b.selected).map((b: any) => b.name),
      min: minParam ? Number(minParam) : undefined,
      max: maxParam ? Number(maxParam) : undefined,
      sort: sortParam,
    });
  }

  function handleCheckboxChange(brandName: string) {
    setBrands((prevBrands: any[]) => {
      const updatedBrands = prevBrands.map((brand) =>
        brand.name === brandName
          ? { ...brand, selected: !brand.selected }
          : brand
      );
      const selected = updatedBrands
        .filter((b) => b.selected)
        .map((b) => b.name);
      updateSearchParams({
        q: search,
        brands: selected,
        min: minParam ? Number(minParam) : undefined,
        max: maxParam ? Number(maxParam) : undefined,
        sort: sortParam,
      });
      return updatedBrands;
    });
  }

  const handleRangeChange = (min: number, max: number) => {
    updateSearchParams({
      q: search,
      brands: brands.filter((b: any) => b.selected).map((b: any) => b.name),
      min: min ? Number(min) : undefined,
      max: max ? Number(max) : undefined,
      sort: sortParam,
    });
  };

  function handleSortChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    setSort(value);
    updateSearchParams({
      q: search,
      brands: brands.filter((b: any) => b.selected).map((b: any) => b.name),
      min: minParam ? Number(minParam) : undefined,
      max: maxParam ? Number(maxParam) : undefined,
      sort: value,
    });
  }

  useEffect(() => {
    fetchProductList();
  }, [query, brandsParam, minParam, maxParam, sortParam]);

  return (
    <div className="mb-15">
      {/* Search Bar */}
      <div className="bg-[#0d2a66] p-8 w-full mx-auto">
        <div className="flex flex-col gap-2 ">
          <div className="flex gap-2 w-full">
            <input
              type="text"
              placeholder="Search products..."
              className="flex-1 px-4 py-2 rounded-md border border-gray-300 text-base bg-white outline-none shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  searchProducts();
                }
              }}
            />
            <button
              className="px-5 py-2 rounded-md bg-blue-600 text-white font-semibold text-base hover:bg-blue-700 transition-colors cursor-pointer"
              onClick={searchProducts}
            >
              Search
            </button>
          </div>
          <div className="flex gap-4 mt-4">
            {/* Dropdown with checkbox */}
            <div className="relative">
              <button
                type="button"
                className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm flex items-center gap-2 hover:bg-gray-100 focus:outline-none"
                onClick={() => setShowDropdown((prev) => !prev)}
              >
                Brands
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {showDropdown && (
                <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10 p-3">
                  {brands.map((option) => (
                    <label
                      key={option.name}
                      className="flex items-center gap-2 py-1 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={option.selected}
                        onChange={() => handleCheckboxChange(option.name)}
                        className="accent-blue-600"
                      />
                      <span className="text-gray-700">{option.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            {/* Price slider */}
            <div className="flex align-center justify-center pt-3">
              <DualRangeSlider onChange={handleRangeChange} />
            </div>
          </div>
        </div>
      </div>
      {/* Product List */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold mt-8 mb-4">Products</h2>
          <div className="relative">
            <select
              className="border border-gray-300 rounded-md px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={sort}
              onChange={handleSortChange}
            >
              <option value="">Sort by</option>
              <option value="price-asc">Price: Lowest - Highest</option>
              <option value="price-desc">Price: Highest - Lowest</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading && (
            <div className="col-span-full text-center text-gray-500">
              Loading...
            </div>
          )}
          {products?.map((product) => (
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
              <span className="text-xl font-bold text-blue-600">
                ${product.price}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsLayout;

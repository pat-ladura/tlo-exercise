import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET(req: NextRequest) {
  const filePath = path.join(
    process.cwd(),
    "public",
    "products",
    "response.json"
  );
  const fileContents = await fs.readFile(filePath, "utf-8");
  const data = JSON.parse(fileContents);

  // Get search query from URL
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.toLowerCase() || "";
  const brandsParam = searchParams.get("brands");
  const minParam = Number(searchParams.get("min"));
  const maxParam = Number(searchParams.get("max"));
  const sortParam = searchParams.get("sort") || undefined;

  // Parse brands from search params
  const selectedBrands = brandsParam
    ? brandsParam.split(",").filter(Boolean)
    : [];

  const filteredResults = searchProducts(
    data.results,
    q,
    selectedBrands,
    isNaN(minParam) ? undefined : minParam,
    isNaN(maxParam) ? undefined : maxParam,
    sortParam
  );

  // Prevent caching
  return NextResponse.json({
    ...data,
    results: filteredResults,
    brands: data.results,
  });
}

// Search function for product names, brands, price range, and sorting
function searchProducts(
  products: any[],
  query: string,
  brands: string[] = [],
  min?: number,
  max?: number,
  sort?: string
) {
  let filtered = products;
  if (query) {
    filtered = filtered.filter((product) =>
      product.name?.toLowerCase().includes(query)
    );
  }
  if (brands.length > 0) {
    filtered = filtered.filter((product) => brands.includes(product.brand));
  }
  if (min !== undefined && !isNaN(min)) {
    filtered = filtered.filter((product) => Number(product.price) >= min);
  }
  if (max !== undefined && !isNaN(max)) {
    filtered = filtered.filter((product) => Number(product.price) <= max);
  }
  if (sort === "price-asc") {
    filtered = filtered.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sort === "price-desc") {
    filtered = filtered.sort((a, b) => Number(b.price) - Number(a.price));
  }
  return filtered;
}

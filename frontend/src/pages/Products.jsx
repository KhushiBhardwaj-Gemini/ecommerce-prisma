import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "../components/ProductCard";
import Select from "../components/Select";
import useCart from "../hooks/useCart";
import API from "../utils/api";

const fetchProducts = async ({ queryKey }) => {
  const [, params] = queryKey;

  if (params.search && params.search.length < 3) {
    return { products: [] };
  }

  const res = await API.get("/products", {
    params,
  });

  return res.data;
};

const Products = () => {
  const [darkMode, setDarkMode] = useState(false);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const { data: cartItems } = useCart();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      "products",
      { search: debouncedSearch, category, sort, page: 1 },
    ],
    queryFn: fetchProducts,
  });

  return (
    <div
      className={`
      min-h-screen
      px-4
      pt-5
      pb-8
      md:px-8
      lg:px-14
      ${darkMode ? "bg-[#0f172a]" : "bg-[#f8fafc]"}
    `}
    >
      {/* CONTROLS */}
      <div
        className="
        mb-10
        flex
        flex-col
        gap-4
        rounded-3xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
        lg:flex-1
        lg:flex-row
        lg:items-center
        lg:justify-between
      "
      >
        <div className="flex flex-1 flex-col gap-4 lg:flex-row">
          <input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
            h-14
            w-full
            rounded-2xl
            border
            border-slate-200
            bg-slate-50
            px-5
            text-sm
            outline-none
            transition-all
            duration-300
            focus:border-amber-400
            focus:ring-4
            focus:ring-amber-100
            lg:flex-1

          "
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="
            h-14
            w-full
            lg:w-[220px]
            rounded-2xl
            border
            border-slate-200
            bg-slate-50
            px-5
            text-sm
            outline-none
          "
          >
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="jwellery">Jewellery</option>
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="
            h-14
            w-full
            lg:w-[220px]
            rounded-2xl
            border
            border-slate-200
            bg-slate-50
            px-5
            text-sm
            outline-none
          "
          >
            <option value="">Sort By</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* PRODUCTS */}
      <div
        className="
        grid
        grid-cols-1
        justify-items-center
        gap-6
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
      "
      >
        {isLoading ? (
          <div>Loading...</div>
        ) : isError ? (
          <div>Error loading data</div>
        ) : (
          data?.products?.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              darkMode={darkMode}
              cartItems={cartItems}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Products;

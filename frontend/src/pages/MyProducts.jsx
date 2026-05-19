import { useQuery } from "@tanstack/react-query";
import API from "../utils/api";
import ProductCard from "../components/ProductCard";

const MyProducts = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await API.get("/auth/me");
      return res.data;
    },
  });
  if (isLoading) return <p>Loading...</p>;
  if (isError) {
    return (
      <div className="products-container">
        <p style={{ color: "red" }}>{error?.message}</p>
      </div>
    );
  }

  const products = data?.products || [];

  return (
  <div
    className="
      min-h-screen
      bg-slate-100
      px-4
      py-10
      lg:px-10
    "
  >
    <div
      className="
        mx-auto
        max-w-7xl
      "
    >
      {/* HEADER */}
      <div className="mb-12 text-center">
        <div
          className="
            inline-flex
            mx-auto
            rounded-full
            bg-orange-100
            px-4
            py-1
            text-sm
            font-semibold
            text-orange-700
          "
        >
          Inventory Management
        </div>

        <div
          className="
            mt-3
            text-[32px]
            font-semibold
            tracking-tight
            text-slate-900
          "
        >
          {data.name}'s Products
        </div>

        <div
          className="
            mt-2
            text-slate-500
          "
        >
          Manage and track all products you’ve added to the store.
        </div>
      </div>

      {/* STATS */}
      <div
        className="
          mt-6
          flex
          items-center
          justify-center
          gap-3
        "
      >
        <span
          className="
            text-slate-500
            text-lg
          "
        >
          Total Products
        </span>

        <div
          className="
            rounded-full
            bg-slate-900
            px-4
            py-1
            text-sm
            font-semibold
            text-white
          "
        >
          {products.length}
        </div>
      </div>

      {/* EMPTY STATE */}
      {products.length === 0 ? (
        <div
          className="
            rounded-[28px]
            border
            border-dashed
            border-slate-300
            bg-white
            py-24
            text-center
            shadow-sm
          "
        >
          <div
            className="
              text-2xl
              font-semibold
              text-slate-700
            "
          >
            No products added yet
          </div>

          <div
            className="
              mt-2
              text-slate-500
            "
          >
            Start adding products to build your store inventory.
          </div>
        </div>
      ) : (
        <div
          className="
            flex
            flex-wrap
            justify-center
            mt-4
            gap-8
          "
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              hideCartButton={true}
            />
          ))}
        </div>
      )}
    </div>
  </div>
);
};
export default MyProducts;

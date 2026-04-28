import { useQuery } from "@tanstack/react-query";
import API from "../utils/api";
import ProductCard from "../components/ProductCard";
import "../styles/myProducts.css";

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
    <div className="products-container">
      <div className="products-header">
        <h2 className="products-title">{data.name}'s Products</h2>

        <p className="products-subtitle">Total: {products.length}</p>
      </div>

      {products.length === 0 ? (
        <p className="products-empty">You haven't added any products yet</p>
      ) : (
        <div className="grid products-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
export default MyProducts;

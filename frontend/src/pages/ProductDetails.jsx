import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import API from "../utils/api";
import "../styles/productDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await API.get(`/products/${id}`);
      return res.data;
    },
  });

  if (isLoading) return <p style={{ padding: "20px" }}>Loading...</p>;

  if (isError) {
    return (
      <div style={{ padding: "20px" }}>
        <p style={{ color: "red" }}>Failed to load product</p>
        <button onClick={() => navigate("/")}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="product-details-container">
      <div className="product-details-card">
        <img
          src={`http://localhost:5000/uploads/${data.image}`}
          alt={data.title}
          className="product-details-image"
        />

        <h2 className="product-details-title">{data.title}</h2>

        <p className="product-details-info">
          <strong>Price:</strong> ${data.price}
        </p>

        <p className="product-details-info">
          <strong>Category:</strong> {data.category}
        </p>

        <p className="product-details-info">
          <strong>Description:</strong> {data.description}
        </p>

        <p className="product-details-info">
          <strong>Seller:</strong> {data.user?.name}
        </p>

        <button className="back-btn" onClick={() => navigate("/")}>
          Back
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;

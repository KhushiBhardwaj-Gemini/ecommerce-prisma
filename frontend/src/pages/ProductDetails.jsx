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

        <h3 className="added-users-title">Added by users:</h3>
        <div className="users-list">
          {data?.cart?.length === 0 ? (
            <p>No one has added this product</p>
          ) : (
            data?.cart?.map((c) => (
              <div className="user-card" key={c.user.id}>
                <div className="user-avatar">
                  {c.user.name.charAt(0).toUpperCase()}
                </div>

                <div className="user-info">
                  <span className="user-name">{c.user.name}</span>
                  <span className="user-id">ID: {c.user.id}</span>
                </div>
              </div>
            ))
          )}
        </div>

        <button className="back-btn" onClick={() => navigate("/")}>
          Back
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;

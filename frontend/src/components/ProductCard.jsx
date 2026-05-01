import { useState, useEffect } from "react";
import API from "../utils/api";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import "../styles/product.css";
import { ROLES } from "../constants/roles";
import { toast } from "react-toastify";

const ProductCard = ({ product, darkMode, isCart = false, cartItems = [] }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  //fetch cart from DB
  const cartItem = cartItems?.find((item) => item.productId === product.id);
  const quantity = cartItem?.quantity || 0;
  const isInCart = quantity > 0;

  const total = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0,
  );
  const [budget, setBudget] = useState(
    Number(localStorage.getItem("budget")) || 0,
  );

  useEffect(() => {
    localStorage.setItem("budget", budget);
  }, [budget]);

  const user = JSON.parse(localStorage.getItem("user"));

  const isOwner = user && product.user_id === user.id;
  const isAdmin = user?.role === ROLES.ADMIN;
  const canEdit = isOwner || isAdmin;

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await API.delete(`/products/${id}`);
      queryClient.invalidateQueries(["products"]);
      toast.success("Product deleted successfully");
    } catch (err) {
      toast.error(err);
    }
  };
  const willExceedBudget = budget && total + product.price > budget;

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    try {
      await API.post("/cart/add", {
        productId: product.id,
      });
      queryClient.invalidateQueries(["cart"]);
    } catch (err) {
      toast.error("Failed to add to cart");
    }
  };

  const handleIncrease = async (e) => {
    e.stopPropagation();
    await API.patch("/cart/update", {
      productId: product.id,
      type: "increase",
    });
    queryClient.invalidateQueries(["cart"]);
  };

  const handleDecrease = async (e) => {
    e.stopPropagation();
    await API.patch("/cart/update", {
      productId: product.id,
      type: "decrease",
    });
    queryClient.invalidateQueries(["cart"]);
  };

  return (
    <div
      className={darkMode ? "card dark" : "card"}
      onClick={() => navigate(`/products/${product.id}`)}
    >
      <div className="image-container">
        <img
          src={`http://localhost:5000/uploads/${product.image}`}
          alt={product.title ?? "Product Image here"}
        />
      </div>

      <div>{product.title}</div>
      <div className="price">${product.price}</div>

      <div className="card-buttons">
        {isCart || quantity > 0 ? (
          <div className="qty-controls">
            <button onClick={handleDecrease}>-</button>

            <span>{quantity}</span>

            <button onClick={handleIncrease} disabled={willExceedBudget}>
              +
            </button>
          </div>
        ) : (
          <button
            className="btn"
            disabled={willExceedBudget}
            onClick={handleAddToCart}
          >
            {willExceedBudget ? "Budget Exceeded" : "Add to Cart"}
          </button>
        )}

        {/* EDIT + DELETE */}
        {!isCart && canEdit && (
          <>
            <button
              className="btn secondary"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/edit/${product.id}`);
              }}
            >
              Edit
            </button>

            <button
              className="btn danger"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(product.id, e);
              }}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductCard;

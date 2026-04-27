import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart, increaseQty, decreaseQty } from "../store/cartSlice";
import API from "../utils/api";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import "../styles/product.css";
import { toast } from "react-toastify";

const ProductCard = ({ product, darkMode, isCart = false }) => {
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.items);
  const budget = useSelector((state) => state.cart.budget);

  const cartItem = cartItems.find((item) => item.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

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
  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const willExceedBudget = budget && total + product.price > budget;

  const isInCart = cartItems.some((item) => item.id === product.id);

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
            <button
              onClick={(e) => {
                e.stopPropagation();
                dispatch(decreaseQty(product.id));
              }}
            >
              -
            </button>

            <span>{quantity}</span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                dispatch(increaseQty(product.id));
              }}
              disabled={willExceedBudget}
            >
              +
            </button>
          </div>
        ) : (
          <button
            className="btn"
            disabled={willExceedBudget}
            onClick={(e) => {
              e.stopPropagation();
              dispatch(addToCart(product));
            }}
          >
            {willExceedBudget ? "Budget Exceeded" : "Add to Cart"}
          </button>
        )}

        {/* EDIT + DELETE */}
        {user && product.user_id === user.id && (
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
              onClick={(e) => handleDelete(product.id, e)}
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

import { useState, useEffect } from "react";
import API from "../utils/api";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ROLES } from "../constants/roles";
import { toast } from "react-toastify";

const ProductCard = ({
  product,
  darkMode,
  isCart = false,
  cartItems = [],
  hideCartButton = false,
}) => {
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
      onClick={() => navigate(`/products/${product.id}`)}
      className="
        group
        cursor-pointer
        overflow-hidden
        w-[250px]
        min-h-[320px]
        rounded-[28px]
        border
        border-slate-200
        bg-white
        p-3
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-2xl
      "
    >
      {/* IMAGE */}
      <div
        className="
        relative
        overflow-hidden
        rounded-[24px]
        bg-slate-100
      "
      >
        <img
          src={`http://localhost:5000/uploads/${product.image}`}
          alt={product.title ?? "Product"}
          className="
          h-[220px]
          w-full
          object-contain
          transition-transform
          duration-500
          group-hover:scale-105
        "
        />
      </div>

      {/* CONTENT */}
      <div className="
          mt-4
          flex
          h-[160px]
          flex-col"
      >
        <div className="flex items-start justify-between gap-3">
          <h3
            className="
            line-clamp-2
            min-h-[64px]
            text-[20px]
            font-semibold
            tracking-tight
            text-slate-900
          "
          >
            {product.title}
          </h3>

          <span
            className="
            rounded-full
            bg-amber-100
            px-3
            py-1
            text-sm
            font-bold
            text-amber-700
          "
          >
            ${product.price}
          </span>
        </div>

        <p className="mt-2 text-sm text-slate-500 capitalize">
          {product.category}
        </p>

        {/* BUTTONS */}
        <div className="mt-4 flex justify-center">
          {!hideCartButton && (
            <>
              {isCart || quantity > 0 ? (
                <div
                  className="
                flex
                items-center
                gap-3
                rounded-xl
                border
                border-slate-200
                px-4
                py-2
              "
                >
                  <button
                    onClick={handleDecrease}
                    className="text-base font-bold"
                  >
                    -
                  </button>

                  <span className="font-semibold">{quantity}</span>

                  <button
                    onClick={handleIncrease}
                    disabled={willExceedBudget}
                    className="text-base font-bold"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  disabled={willExceedBudget}
                  onClick={handleAddToCart}
                  className="
                rounded-xl
                bg-slate-900
                px-4
                py-2.5
                text-sm
                font-medium
                text-white
                transition
                hover:bg-slate-800
              "
                >
                  {willExceedBudget ? "Exceeded" : "Add to Cart"}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

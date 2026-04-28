import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import API from "../utils/api";
import ProductCard from "../components/ProductCard";
import { AlertTriangle } from "lucide-react";
import { toast } from "react-toastify";
import "../styles/cart.css";

const Cart = ({ darkMode }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await API.get("/cart");
      return res.data;
    },
  });
  const queryClient = useQueryClient();
  const cartItems = data || [];
  const [budget, setBudget] = useState(
    Number(localStorage.getItem("budget")) || 0,
  );

  useEffect(() => {
    localStorage.setItem("budget", budget);
  }, [budget]);
  const total = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0,
  );

  const handleBuyNow = async () => {
    try {
      await API.delete("/cart/clear");
      toast.success("Order placed successfully!");

      //refetch cart
      queryClient.invalidateQueries(["cart"]);
    } catch (err) {
      toast.error("Failed to place order");
    }
  };

  if (isLoading) {
    return <div style={{ padding: "20px" }}>Loading cart...</div>;
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="budget-strip">
          <div className="budget-group">
            <span className="budget-label">Budget</span>

            <input
              type="number"
              value={budget === 0 ? "" : budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="budget-input"
            />
          </div>

          <div className="budget-divider" />

          <div className="budget-metrics">
            <div className="metric">
              <span>Total</span>
              <strong>${total.toFixed(2)}</strong>
            </div>

            {budget && (
              <div
                className={`metric ${
                  total > budget ? "over-budget" : "within-budget"
                }`}
              >
                <span>Remaining</span>
                <strong>
                  {total > budget ? (
                    <>
                      Exceeded <AlertTriangle size={18} />
                    </>
                  ) : (
                    `$${(budget - total).toFixed(2)}`
                  )}
                </strong>
              </div>
            )}
          </div>
        </div>
        {/* cart items */}
        {cartItems.length === 0 ? (
          <div className="empty-cart">Your cart is empty</div>
        ) : (
          <>
            <div className="grid">
              {cartItems.map((item) => (
                <ProductCard
                  key={item.productId}
                  product={item.product}
                  quantity={item.quantity}
                  darkMode={darkMode}
                  isCart={true}
                />
              ))}
            </div>
            <div className="checkout">
              <p>Total: ${total.toFixed(2)}</p>

              <button className="btn buy-now" onClick={handleBuyNow}>
                Buy Now
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;

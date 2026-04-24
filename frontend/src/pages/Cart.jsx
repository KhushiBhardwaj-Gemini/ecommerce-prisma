import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProductCard from "../components/ProductCard";
import { AlertTriangle } from "lucide-react";
import { setBudget } from "../store/cartSlice";
import "../styles/cart.css";

const Cart = ({ darkMode }) => {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const budget = useSelector((state) => state.cart.budget);

  useEffect(() => {
    localStorage.setItem("budget", budget);
  }, [budget]);
  const total = cartItems.reduce((acc, item) => acc + item.price, 0);
  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="budget-strip">
          <div className="budget-group">
            <span className="budget-label">Budget</span>

            <input
              type="number"
              value={budget === 0 ? "" : budget}
              onChange={(e) => dispatch(setBudget(Number(e.target.value)))}
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
          <div className="grid">
            {cartItems.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                darkMode={darkMode}
                isCart={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;

import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import useCart from "../hooks/useCart";
import API from "../utils/api";
import ProductCard from "../components/ProductCard";
import { AlertTriangle } from "lucide-react";
import { toast } from "react-toastify";

const Cart = ({ darkMode }) => {
  const { data, isLoading } = useCart();
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
        {/* BUDGET SECTION */}
        <div
          className="
            mx-auto
            mb-10
            w-fit
            rounded-[28px]
            border
            border-slate-200
            bg-white
            px-8
            py-6
            shadow-sm
          "
        >
          <div
            className="
            flex
            flex-col
            gap-6
            lg:flex-row
            lg:items-center
            
          "
          >
            {/* LEFT */}
            <div>
              <div
                className="
                mb-2
                text-sm
                font-medium
                text-slate-500
              "
              >
                Budget Limit
              </div>

              <input
                type="number"
                value={budget === 0 ? "" : budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                placeholder="Enter budget"
                className="
                w-full
                rounded-2xl
                border
                border-slate-200
                bg-slate-50
                px-5
                py-4
                text-slate-800
                outline-none
                transition-all
                duration-300
                focus:border-orange-400
                focus:bg-white
                focus:ring-4
                focus:ring-orange-100
                lg:w-[320px]
              "
              />
            </div>

            {/* RIGHT */}
            <div
              className="
              flex
              flex-wrap
              gap-6
            "
            >
              <div
                className="
                rounded-2xl
                bg-slate-50
                px-6
                py-4
              "
              >
                <div
                  className="
                  text-sm
                  text-slate-500
                "
                >
                  Total
                </div>

                <div
                  className="
                  mt-1
                  text-2xl
                  font-bold
                  text-slate-900
                "
                >
                  ${total.toFixed(2)}
                </div>
              </div>

              {budget > 0 && (
                <div
                  className={`
                  rounded-2xl
                  px-6
                  py-4

                  ${total > budget ? "bg-red-50" : "bg-emerald-50"}
                `}
                >
                  <div
                    className={`
                    text-sm

                    ${total > budget ? "text-red-500" : "text-emerald-600"}
                  `}
                  >
                    Remaining
                  </div>

                  <div
                    className={`
                    mt-1
                    flex
                    items-center
                    gap-2
                    text-xl
                    font-bold

                    ${total > budget ? "text-red-600" : "text-emerald-700"}
                  `}
                  >
                    {total > budget ? (
                      <>
                        Exceeded
                        <AlertTriangle size={20} />
                      </>
                    ) : (
                      `$${(budget - total).toFixed(2)}`
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* EMPTY CART */}
        {cartItems.length === 0 ? (
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
              Your cart is empty
            </div>

            <div
              className="
              mt-2
              text-slate-500
            "
            >
              Add products to continue shopping.
            </div>
          </div>
        ) : (
          <>
            {/* PRODUCTS */}
            <div
              className="
                flex
                flex-wrap
                justify-center
                gap-8
              "
            >
              {cartItems.map((item) => (
                <ProductCard
                  key={item.productId}
                  product={item.product}
                  cartItems={cartItems}
                  quantity={item.quantity}
                  darkMode={darkMode}
                  isCart={true}
                />
              ))}
            </div>

            {/* CHECKOUT */}
            <div
              className="
              mt-12
              w-fit
              flex
              flex-col
              items-center
              mx-auto
              gap-6
              rounded-[28px]
              border
              border-slate-200
              bg-white
              px-8
              py-6
              shadow-sm
              lg:flex-row
            "
            >
              <div>
                <div
                  className="
                  text-sm
                  text-slate-500
                "
                >
                  Final Amount
                </div>

                <div
                  className="
                  mt-1
                  text-3xl
                  font-bold
                  text-slate-900
                "
                >
                  ${total.toFixed(2)}
                </div>
              </div>

              <button
                onClick={handleBuyNow}
                className="
                rounded-2xl
                bg-slate-900
                px-10
                py-4
                text-lg
                font-medium
                text-white
                transition-all
                duration-300
                hover:scale-105
                hover:bg-slate-800
              "
              >
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

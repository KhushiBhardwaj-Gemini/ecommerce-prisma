import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import useCart from "../hooks/useCart";
import API from "../utils/api";
import { ROLES } from "../constants/roles";

const Navbar = () => {
  const { data } = useCart();

  const cartItems = data || [];
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="
        fixed
        top-0
        left-0
        right-0
        z-50
        border-b
        border-white/10
        bg-white/80
        backdrop-blur-xl
        shadow-sm
      "
      >
        <div
          className="
          mx-auto
          flex
          
          items-center
          justify-between
          
          px-4
          py-3
          max-w-7xl
          md:px-6
        "
        >
          {/* LEFT */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="
            flex
            items-center
            gap-2
            cursor-pointer
            shrink-0
          "
            onClick={() => navigate("/")}
          >
            <div
              className="
              flex
              h-10
              w-10
              md:h-11 
              md:w-11
              items-center
              justify-center
              rounded-2xl
              bg-amber-500
              text-white
              shadow-lg
            "
            >
              <ShoppingCart size={22} />
            </div>

            <div className="flex flex-col items-start">
              <span
                className="
                text-base
                md:text-lg
                font-bold
                tracking-tight
                text-slate-900
              "
              >
                Product Store
              </span>

              <span
                className="
                hidden
                text-xs
                text-slate-500
                sm:block
              "
              >
                Modern Ecommerce
              </span>
            </div>
          </motion.div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="
            md:hidden
            rounded-xl
            p-2
            text-slate-700
            hover:bg-slate-100
          "
          >
            <Menu size={24} />
          </button>

          {/* RIGHT */}
          <div
            className="
            hidden
            md:flex
            items-center
            justify-end
            gap-3
            md:gap-5
          "
          >
            <Link
              to="/"
              className="
                relative
                text-sm md:text-base
                font-medium
                text-slate-700
                transition-colors
                duration-300
                hover:text-amber-500

                after:absolute
                after:left-0
                after:-bottom-1
                after:h-[2px]
                after:w-full
                after:origin-left
                after:scale-x-0
                after:bg-amber-500
                after:transition-transform
                after:duration-300
                hover:after:scale-x-100
              "
            >
              Home
            </Link>

            <Link
              to="/about"
              className="
                relative
                text-sm md:text-base
                font-medium
                text-slate-700
                transition-colors
                duration-300
                hover:text-amber-500

                after:absolute
                after:left-0
                after:-bottom-1
                after:h-[2px]
                after:w-full
                after:origin-left
                after:scale-x-0
                after:bg-amber-500
                after:transition-transform
                after:duration-300
                hover:after:scale-x-100
              "
            >
              About
            </Link>

            <Link
              to="/add-product"
              className="
                relative
                text-sm md:text-base
                font-medium
                text-slate-700
                transition-colors
                duration-300
                hover:text-amber-500

                after:absolute
                after:left-0
                after:-bottom-1
                after:h-[2px]
                after:w-full
                after:origin-left
                after:scale-x-0
                after:bg-amber-500
                after:transition-transform
                after:duration-300
                hover:after:scale-x-100
              "
            >
              Add Product
            </Link>

            {/* CART */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
              <Link
                to="/cart"
                className="
                relative
                flex
                items-center
                justify-center
                rounded-xl
                bg-slate-100
                p-3
                transition
                hover:bg-amber-500
                hover:text-white
                hover:border-amber-500
              "
              >
                <ShoppingCart size={20} />

                <span
                  className="
                  absolute
                  -right-2
                  -top-2
                  flex
                  h-5
                  min-w-5
                  items-center
                  justify-center
                  rounded-full
                  bg-red-500
                  px-1
                  text-xs
                  font-semibold
                  text-white
                "
                >
                  {cartItems.length}
                </span>
              </Link>
            </motion.div>

            {/* ADMIN */}
            {user?.role === ROLES.ADMIN && (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate("/admin")}
                className="
                rounded-xl
                bg-amber-500
                px-3
                py-2
                md:px-4
                text-sm
                font-semibold
                text-white
                shadow-md
                transition
                hover:bg-amber-600
              "
              >
                Dashboard
              </motion.button>
            )}

            {/* USER */}
            {user && (
              <motion.div
                whileHover={{ scale: 1.03 }}
                onClick={() => navigate("/my-products")}
                className="
                cursor-pointer
                rounded-xl
                bg-slate-100
                px-3
                py-2
                md:px-4
                text-sm
                font-medium
                text-slate-700
                transition
                hover:bg-slate-200
              "
              >
                <span className="hidden sm:inline">Hi, {user.name}</span>
              </motion.div>
            )}

            {/* AUTH */}
            {token ? (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleLogout}
                className="
                rounded-xl
                border
                border-slate-300
                px-3
                py-2
                md:px-4
                text-sm
                font-medium
                text-slate-700
                transition
                hover:bg-amber-500
                hover:text-white
                hover:border-amber-500
              "
              >
                Logout
              </motion.button>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="
                relative
                text-sm md:text-base
                font-medium
                text-slate-700
                transition-colors
                duration-300
                hover:text-amber-500

                after:absolute
                after:left-0
                after:-bottom-1
                after:h-[2px]
                after:w-full
                after:origin-left
                after:scale-x-0
                after:bg-amber-500
                after:transition-transform
                after:duration-300
                hover:after:scale-x-100
              "
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="
                relative
                text-sm md:text-base
                font-medium
                text-slate-700
                transition-colors
                duration-300
                hover:text-amber-500

                after:absolute
                after:left-0
                after:-bottom-1
                after:h-[2px]
                after:w-full
                after:origin-left
                after:scale-x-0
                after:bg-amber-500
                after:transition-transform
                after:duration-300
                hover:after:scale-x-100
              "
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </motion.nav>

      {/* MOBILE SIDEBAR */}
      <div
        className={`
          fixed
          top-0
          right-0
          h-screen
          w-72
          bg-white
          shadow-2xl
          z-50
          transform
          transition-transform
          duration-300
          md:hidden
          ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* TOP */}
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-lg font-bold text-slate-800">Menu</h2>

          <button
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            <X size={22} />
          </button>
        </div>

        {/* LINKS */}
        <div className="flex flex-col p-5 gap-5">
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>
            Home
          </Link>

          <Link to="/about" onClick={() => setMobileMenuOpen(false)}>
            About
          </Link>

          <Link to="/add-product" onClick={() => setMobileMenuOpen(false)}>
            Add Product
          </Link>

          <Link
            to="/cart"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2"
          >
            <ShoppingCart size={18} />
            Cart ({cartItems.length})
          </Link>

          {user?.role === ROLES.ADMIN && (
            <button
              onClick={() => {
                navigate("/admin");
                setMobileMenuOpen(false);
              }}
              className="
                text-left
                text-lg
                font-medium
                text-slate-700
                transition
                hover:text-amber-500
              "
            >
              Dashboard
            </button>
          )}

          {user && (
            <button
              onClick={() => {
                navigate("/my-products");
                setMobileMenuOpen(false);
              }}
              className="
                text-left
                text-lg
                font-medium
                text-slate-700
                transition
                hover:text-amber-500
              "
            >
              Hi, {user.name}
            </button>
          )}

          {token ? (
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="
                text-left
                text-lg
                font-medium
                text-slate-700
                transition
                hover:text-amber-500
              "
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                Login
              </Link>

              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="
                rounded-xl
                bg-amber-500
                px-4
                py-2
                text-white
                text-center
                "
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {/* OVERLAY */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="
            fixed
            inset-0
            bg-black/40
            z-40
            md:hidden
          "
        />
      )}
    </>
  );
};

export default Navbar;

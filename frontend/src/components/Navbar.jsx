import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ShoppingCart } from "lucide-react";

const Navbar = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="navbar">
      <div className="nav-left">
        <ShoppingCart size={20} />
        <span> Product Store</span>
      </div>

      <div className="nav-right">
        <Link to="/">Home</Link>
        <Link to="/about">About Us</Link>

        <Link to="/cart" className="cart-link">
          <ShoppingCart size={18} />
          <span className="cart-badge">{cartItems.length}</span>
        </Link>

        <Link to="/add-product">Add Product</Link>

        {user && <span className="nav-user">Hi, {user.name}</span>}
        {token ? (
          <span className="nav-link" onClick={handleLogout}>
            Logout
          </span>
        ) : (
          <>
            <Link to="/login" className="auth-btn">
              Login
            </Link>
            <Link to="/register" className="auth-btn">
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;

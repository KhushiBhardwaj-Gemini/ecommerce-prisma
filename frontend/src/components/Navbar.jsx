import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react"; 
import useCart from "../hooks/useCart";
import API from "../utils/api";
import { ROLES } from "../constants/roles";

const Navbar = () => {
  const { data } = useCart();

  const cartItems = data || [];
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
        {user?.role === ROLES.ADMIN && (
          <button className="admin-btn" onClick={() => navigate("/admin")}>Admin Dashboard</button>
        )}
        {user && (
          <span
            className="nav-user"
            onClick={() => navigate("/my-products")}
            style={{ cursor: "pointer" }}
          >
            Hi, {user.name}
          </span>
        )}
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

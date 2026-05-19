import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Sun, Moon } from "lucide-react";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import ProductCard from "./components/ProductCard";
import Select from "./components/Select";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Cart from "./pages/Cart";
import About from "./pages/About";
import MyProducts from "./pages/MyProducts";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import ProductDetails from "./pages/ProductDetails";
import AdminDashboard from "./pages/AdminDashboard";
import useCart from "./hooks/useCart";
import HeroSection from "./components/HeroSection";
import Home from "./pages/Home";
import Products from "./pages/Products";


import API from "./utils/api";

const fetchProducts = async ({ queryKey }) => {
  const [, params] = queryKey;
  if (params.search && params.search.length < 3) {
    return { products: [] }; // skip API
  }
  const res = await API.get("/products", {
    params,
  });

  return res.data;
};

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const { data: cartItems } = useCart();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); // wait 500ms

    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      "products",
      { search: debouncedSearch, category, sort, page: 1 },
    ],
    queryFn: fetchProducts,
  });

  return (
    <div className="min-h-screen bg-[#f8f8f8] pt-24">
      <Navbar />

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PROTECTED ROUTES */}

        {/* HOME */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        <Route
          path="/products"
          element={
            <PrivateRoute>
              <Products />
            </PrivateRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <Cart darkMode={darkMode} />
            </PrivateRoute>
          }
        />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route
          path="/my-products"
          element={
            <PrivateRoute>
              <MyProducts />
            </PrivateRoute>
          }
        />

        <Route
          path="/add-product"
          element={
            <PrivateRoute>
              <AddProduct />
            </PrivateRoute>
          }
        />

        <Route
          path="/products/:id"
          element={
            <PrivateRoute>
              <ProductDetails />
            </PrivateRoute>
          }
        />

        <Route
          path="/edit/:id"
          element={
            <PrivateRoute>
              <EditProduct />
            </PrivateRoute>
          }
        />

        <Route
          path="/about"
          element={
            <PrivateRoute>
              <About />
            </PrivateRoute>
          }
        />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;

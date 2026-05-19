import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import API from "../utils/api";
import { ROLES } from "../constants/roles";
import { useQueryClient } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { toast } from "react-toastify";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const user = JSON.parse(localStorage.getItem("user"));

  const { data, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await API.get(`/products/${id}`);
      return res.data;
    },
  });

  const isOwner = user && data?.user_id === user.id;
  const isAdmin = user?.role === ROLES.ADMIN;
  const canEdit = isOwner || isAdmin;

  const handleDelete = async () => {
    try {
      await API.delete(`/products/${id}`);
      toast.success("Product deleted");
      navigate("/products");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleAddToCart = async () => {
    try {
      await API.post("/cart/add", {
        productId: data.id,
      });

      queryClient.invalidateQueries(["cart"]);

      toast.success("Added to cart");
    } catch (err) {
      toast.error("Failed to add to cart");
    }
  };

  const handleBuyNow = async () => {
    try {
      toast.success("Order placed successfully");
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  if (isLoading) return <p style={{ padding: "20px" }}>Loading...</p>;

  if (isError) {
    return (
      <div style={{ padding: "20px" }}>
        <p style={{ color: "red" }}>Failed to load product</p>
        <button onClick={() => navigate("/products")}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-10">
      <div
        className="
        mx-auto
        grid
        max-w-7xl
        items-stretch
        gap-8
        lg:grid-cols-[1fr_1fr_340px]
      "
      >
        {/* LEFT IMAGE SECTION */}
        <div
          className="
          rounded-3xl
          bg-white
          p-6
          shadow-sm
        "
        >
          <div
            className="
            flex
            items-center
            justify-center
            rounded-2xl
            bg-slate-100
            p-6
          "
          >
            <img
              src={`http://localhost:5000/uploads/${data.image}`}
              alt={data.title}
              className="
              max-h-[500px]
              w-full
              object-contain
              transition
              duration-300
              hover:scale-[1.02]
            "
            />
          </div>
        </div>

        {/* CENTER INFO SECTION */}
        <div
          className="
          rounded-3xl
          bg-white
          p-8
          shadow-sm
        "
        >
          <div
            className="
            mb-4
            inline-flex
            rounded-full
            bg-orange-100
            px-4
            py-1
            text-sm
            font-medium
            text-orange-700
          "
          >
            {data.category}
          </div>

          <div
            className="
            text-4xl
            font-bold
            tracking-tight
            text-slate-900
          "
          >
            {data.title}
          </div>

          <div
            className="
            mt-5
            text-3xl
            font-semibold
            text-slate-900
          "
          >
            ${data.price}
          </div>

          <div
            className="
            mt-6
            leading-8
            text-slate-600
          "
          >
            {data.description}
          </div>

          <div
            className="
            mt-8
            rounded-2xl
            border
            border-slate-200
            bg-slate-50
            p-5
          "
          >
            <div className="text-sm text-slate-500">Seller</div>

            <div
              className="
              mt-1
              text-lg
              font-semibold
              text-slate-900
            "
            >
              {data.user?.name}
            </div>
          </div>

          {/* OWNER ACTIONS */}
          {canEdit && (
            <div className="mt-8 flex gap-4">
              <button
                onClick={() => navigate(`/edit/${id}`)}
                className="
                rounded-2xl
                bg-slate-900
                px-6
                py-3
                font-medium
                text-white
                transition
                hover:bg-slate-800
              "
              >
                Edit Product
              </button>

              <button
                onClick={handleDelete}
                className="
                rounded-2xl
                bg-red-500
                px-6
                py-3
                font-medium
                text-white
                transition
                hover:bg-red-600
              "
              >
                Delete
              </button>
            </div>
          )}

          {/* USERS */}
          <div className="mt-10">
            <div
              className="
              mb-4
              text-xl
              font-semibold
              text-slate-900
            "
            >
              Interested Customers
            </div>

            <div className="flex flex-wrap gap-3">
              {data?.cart?.length === 0 ? (
                <div className="text-slate-500">No customers yet</div>
              ) : (
                data?.cart?.map((c) => (
                  <div
                    key={c.user.id}
                    className="
                    flex
                    items-center
                    gap-3
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    px-4
                    py-3
                  "
                  >
                    <div
                      className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-full
                      bg-orange-100
                      font-semibold
                      text-orange-700
                    "
                    >
                      {c.user.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="font-medium text-slate-700">
                      {c.user.name}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* RIGHT PURCHASE BOX */}
        <div
          className="
          flex
          h-full
          flex-col
          rounded-3xl
          bg-white
          p-6
          shadow-sm
        "
        >
          <div
            className="
            text-3xl
            font-bold
            text-slate-900
          "
          >
            ${data.price}
          </div>

          <button
            onClick={handleAddToCart}
            className="
            mt-6
            w-full
            rounded-2xl
            bg-slate-900
            px-6
            py-4
            font-semibold
            text-white
            transition
            hover:bg-slate-800
          "
          >
            Add to Cart
          </button>

          <button
            onClick={handleBuyNow}
            className="
            mt-4
            w-full
            rounded-2xl
            bg-orange-500
            px-6
            py-4
            font-semibold
            text-white
            transition
            hover:bg-orange-600
          "
          >
            Buy Now
          </button>

          <div
            className="
            mt-12
            border-t
            border-slate-200
            pt-5
            text-sm
            leading-7
            text-slate-500
          "
          >
            {["Secure Checkout", "Fast Delivery", "Premium Quality"].map(
              (item) => (
                <div key={item} className="flex items-center gap-2">
                  <Check size={18} className="text-emerald-500" />

                  <span>{item}</span>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

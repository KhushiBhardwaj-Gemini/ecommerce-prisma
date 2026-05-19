import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useState } from "react";
import Input from "../components/form/TextInput";
import SelectInput from "../components/form/SelectInput";
import FileInput from "../components/form/FileInput";
import { toast } from "react-toastify";
import API from "../utils/api";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [error, setError] = useState("");

  // Fetch product data
  const { data, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await API.get(`/products/${id}`);
      return res.data;
    },
  });

  // Form setup
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: data?.title || "",
      price: data?.price || "",
      description: data?.description || "",
      category: data?.category || "",
      image: null,
    },

    onSubmit: async (values) => {
      try {
        setError("");

        const formData = new FormData();

        formData.append("title", values.title);
        formData.append("price", values.price);
        formData.append("description", values.description);
        formData.append("category", values.category);

        if (values.image) {
          formData.append("image", values.image);
        }

        await API.patch(`/products/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        queryClient.invalidateQueries(["products"]);
        toast.success("Product updated successfully");

        navigate("/products");
      } catch (err) {
        setError(err.response?.data?.msg || "Update failed");
        toast.error(err.response?.data?.msg || "Update failed");
      }
    },
  });

  // Loading state
  if (isLoading) return <div>Loading...</div>;

  // Error fetching product
  if (isError) return <div>Error loading product</div>;

  return (
    <div
      className="
      min-h-screen
      bg-gradient-to-br
      from-amber-50
      via-white
      to-orange-100
      px-4
      py-10
    "
    >
      <div
        className="
        mx-auto
        max-w-2xl
        rounded-3xl
        border
        border-amber-100
        bg-white/90
        p-8
        shadow-2xl
        backdrop-blur
      "
      >
        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-extrabold text-bold">
            Edit Product
          </h1>

          <p className="mt-2 text-slate-500">Update your product details</p>
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="
            mb-5
            rounded-2xl
            border
            border-red-200
            bg-red-50
            px-4
            py-3
            text-sm
            font-medium
            text-red-600
          "
          >
            {error}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          {/* Title */}
          <Input name="title" placeholder="Title" formik={formik} />

          {/* Price */}
          <Input name="price" placeholder="Price" formik={formik} />

          {/* Description */}
          <Input name="description" placeholder="Description" formik={formik} />

          {/* Category */}
          <SelectInput
            name="category"
            placeholder="Select Category"
            formik={formik}
            options={[
              { label: "Electronics", value: "electronics" },
              { label: "Men", value: "men" },
              { label: "Women", value: "women" },
              { label: "Jewellery", value: "jewellery" },
            ]}
          />

          {/* Image Upload */}
          <div
            className="
            rounded-2xl
            border-2
            border-dashed
            border-amber-200
            bg-amber-50/40
            p-4
          "
          >
            <FileInput name="image" formik={formik} />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="
            w-full
            rounded-2xl
            bg-amber-500
            px-6
            py-3
            text-lg
            font-semibold
            text-white
            shadow-lg
            transition-all
            duration-300
            active:scale-95
          "
          >
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProduct;

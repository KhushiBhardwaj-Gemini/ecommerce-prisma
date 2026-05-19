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
    <div className="auth-container">
      <div
        className="
          mt-4
          mb-4
          text-xl
          font-bold
          text-slate-900
        "  
      >
        Edit Product
      </div>

      {/* error message */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={formik.handleSubmit}>
        {/* title */}
        <Input name="title" placeholder="Title" formik={formik} />

        {/* price */}
        <Input name="price" placeholder="Price" formik={formik} />

        {/* desc */}
        <Input name="description" placeholder="Description" formik={formik} />

        {/* category */}
        <SelectInput
          name="category"
          placeholder="Select Category"
          formik={formik}
          options={[
            { label: "Electronics", value: "electronics" },
            { label: "Men", value: "men" },
            { label: "Women", value: "women" },
            { label: "Jwellery", value: "jwellery" },
          ]}
        />
        {/* img */}
        <FileInput name="image" formik={formik} />

        <button type="submit">Update Product</button>
      </form>
    </div>
  );
}

export default EditProduct;

import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useQueryClient } from "@tanstack/react-query";
import * as Yup from "yup";
import API from "../utils/api";
import Input from "../components/form/TextInput";
import SelectInput from "../components/form/SelectInput";
import FileInput from "../components/form/FileInput";
import { toast } from "react-toastify";

function AddProduct() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const formik = useFormik({
    initialValues: {
      title: "",
      price: "",
      description: "",
      category: "",
      image: null,
    },

    validationSchema: Yup.object({
      title: Yup.string().required("Product name is required"),
      price: Yup.number()
        .typeError("Price must be a number")
        .required("Price is required"),
      description: Yup.string(),
      category: Yup.string().required("Category is required"),
    }),

    onSubmit: async (values) => {
      try {
        const formData = new FormData();

        Object.keys(values).forEach((key) => {
          if (key === "image") {
            if (values.image) {
              formData.append("image", values.image);
            }
          } else if (key === "price") {
            formData.append("price", Number(values.price));
          } else {
            formData.append(key, values[key]);
          }
        });

        await API.post("/products", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        queryClient.invalidateQueries(["products"]);

        toast.success("Product added successfully");

        navigate("/");
      } catch (err) {
        toast.error(err.response?.data?.message || "Something went wrong");
      }
    },
  });

  return (
    <div
      className="
      min-h-screen
      bg-gradient-to-br
      from-orange-50
      via-white
      to-amber-100
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
        border-orange-100
        bg-white/90
        p-8
        shadow-2xl
        backdrop-blur
      "
      >
        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-extrabold text-slate-900">
            Add Product
          </h1>

          <p className="mt-2 text-slate-500">Add a new item to your store</p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          {/* Product Title */}
          <Input name="title" placeholder="Product Name" formik={formik} />

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
            border-orange-200
            bg-orange-50/40
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
            hover:-translate-y-1
            hover:shadow-xl
            active:scale-95
          "
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;

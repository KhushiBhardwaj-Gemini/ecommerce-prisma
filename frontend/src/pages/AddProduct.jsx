import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useQueryClient } from "@tanstack/react-query";
import * as Yup from "yup";
import API from "../utils/api";
import "../styles/auth.css";
import Input from "../components/form/TextInput";
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
    <div className="auth-container">
      <h2>Add Product</h2>

      <form onSubmit={formik.handleSubmit}>
        {/*product title*/}
        <Input name="title" placeholder="Product Name" formik={formik} />

        {/*price*/}
        <Input name="price" placeholder="Price" formik={formik} />

        {/*desc*/}
        <Input name="description" placeholder="Description" formik={formik} />

        {/* category */}
        <select
          name="category"
          onChange={formik.handleChange}
          value={formik.values.category}
        >
          <option value="">Select Category</option>
          <option value="electronics">Electronics</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="jwellery">Jwellery</option>
        </select>

        {formik.touched.category && formik.errors.category && (
          <p className="error-text">{formik.errors.category}</p>
        )}

        {/* img */}
        <input
          type="file"
          name="image"
          onChange={(e) =>
            formik.setFieldValue("image", e.currentTarget.files[0])
          }
        />

        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}

export default AddProduct;

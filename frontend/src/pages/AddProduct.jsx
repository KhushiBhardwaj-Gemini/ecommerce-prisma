import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useQueryClient } from "@tanstack/react-query";
import * as Yup from "yup";
import API from "../utils/api";
import "../styles/auth.css";
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
          if (values[key]) {
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
        toast.error(err);
      }
    },
  });

  return (
    <div className="auth-container">
      <h2>Add Product</h2>

      <form onSubmit={formik.handleSubmit}>
        {/*product title*/}
        <input
          name="title"
          placeholder="Product Name"
          onChange={formik.handleChange}
          value={formik.values.title}
        />
        {formik.touched.title && formik.errors.title && (
          <p className="error-text">{formik.errors.title}</p>
        )}

        {/*price*/}
        <input
          name="price"
          placeholder="Price"
          onChange={formik.handleChange}
          value={formik.values.price}
        />
        {formik.touched.price && formik.errors.price && (
          <p className="error-text">{formik.errors.price}</p>
        )}

        {/*desc*/}
        <input
          name="description"
          placeholder="Description"
          onChange={formik.handleChange}
          value={formik.values.description}
        />

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

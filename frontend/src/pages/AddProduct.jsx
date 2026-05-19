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
        Add Product
      </div>

      <form onSubmit={formik.handleSubmit}>
        {/*product title*/}
        <Input name="title" placeholder="Product Name" formik={formik} />

        {/*price*/}
        <Input name="price" placeholder="Price" formik={formik} />

        {/*desc*/}
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

        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}

export default AddProduct;

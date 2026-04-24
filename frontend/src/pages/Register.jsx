import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import API from "../utils/api";
import Input from "../components/form/TextInput/index.jsx";
import "../styles/auth.css";

function Register() {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .matches(/^[A-Za-z\s]+$/, "Only letters allowed")
        .required("Name is required"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),

      password: Yup.string()
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/,
          "Password must contain letters, numbers and at least one special character",
        )
        .required("Password is required"),
    }),

    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const res = await API.post("/auth/register", values);
        navigate("/login");
      } catch (err) {
        setErrors({
          general: err.response?.data?.msg || "Registration failed",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="auth-container">
      <h2>Register</h2>

      <form onSubmit={formik.handleSubmit}>
        {formik.errors.general && (
          <p className="error-text">{formik.errors.general}</p>
        )}

        <Input name="name" placeholder="Name" formik={formik} />
        <Input name="email" placeholder="Email" formik={formik} />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          formik={formik}
        />

        <button type="submit" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? "Registering..." : "Get Started"}
        </button>
      </form>
    </div>
  );
}

export default Register;

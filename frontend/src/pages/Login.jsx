import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import API from "../utils/api";
import Input from "../components/form/TextInput/index.jsx";
import "../styles/auth.css";

function Login() {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
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
        const res = await API.post("/auth/login", values);

        localStorage.setItem("token", res.data.token);

        const userRes = await API.get("/auth/me");
        localStorage.setItem("user", JSON.stringify(userRes.data));

        navigate("/");
      } catch (err) {
        setErrors({
          general: err.response?.data?.msg || "Login failed",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="auth-container">
      <h2>Login</h2>

      <form onSubmit={formik.handleSubmit}>
        {formik.errors.general && (
          <p className="error-text">{formik.errors.general}</p>
        )}

        <Input name="email" placeholder="Email" formik={formik} />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          formik={formik}
        />

        <button type="submit" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;

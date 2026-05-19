import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import API from "../utils/api";
import Input from "../components/form/TextInput/index.jsx";


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
  <div
    className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-gradient-to-br
      from-amber-50
      via-white
      to-orange-100
      px-4
    "
  >
    <div
      className="
        w-full
        max-w-md
        rounded-3xl
        border
        border-slate-100
        bg-white
        p-8
        shadow-2xl
      "
    >
      {/* Heading */}
      <div className="mb-8 text-center">
        <h2
          className="
            text-3xl
            font-bold
            text-slate-900
          "
        >
          Create Account
        </h2>
 
        <p className="mt-2 text-sm text-slate-500">
          Join our ecommerce platform today
        </p>
      </div>
 
      {/* Form */}
      <form
        onSubmit={formik.handleSubmit}
        className="space-y-5"
      >
        {/* General Error */}
        {formik.errors.general && (
          <p
            className="
              rounded-xl
              bg-red-50
              px-4
              py-3
              text-sm
              text-red-500
            "
          >
            {formik.errors.general}
          </p>
        )}
 
        {/* Name */}
        <Input
          name="name"
          placeholder="Full Name"
          formik={formik}
        />
 
        {/* Email */}
        <Input
          name="email"
          placeholder="Email"
          formik={formik}
        />
 
        {/* Password */}
        <Input
          name="password"
          type="password"
          placeholder="Password"
          formik={formik}
        />
 
        {/* Submit Button */}
        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="
            w-full
            rounded-2xl
            bg-amber-500
            px-4
            py-3
            text-sm
            font-semibold
            text-white
            shadow-lg
            transition-all
            duration-200
            hover:bg-amber-600
            hover:shadow-xl
            disabled:cursor-not-allowed
            disabled:opacity-70
          "
        >
          {formik.isSubmitting
            ? "Registering..."
            : "Get Started"}
        </button>
      </form>
 
      {/* Bottom Text */}
      <p
        className="
          mt-6
          text-center
          text-sm
          text-slate-500
        "
      >
        Already have an account?{" "}
        <span
          onClick={() => navigate("/login")}
          className="
            cursor-pointer
            font-semibold
            text-amber-500
            transition
            hover:text-amber-600
          "
        >
          Login
        </span>
      </p>
    </div>
  </div>
);
}

export default Register;

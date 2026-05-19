import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import API from "../utils/api";
import Input from "../components/form/TextInput/index.jsx";

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
        bg-white
        p-8
        shadow-2xl
        border
        border-slate-100
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
            Welcome Back
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Login to continue shopping
          </p>
        </div>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="space-y-5">
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

          {/* Email */}
          <Input name="email" placeholder="Email" formik={formik} />

          {/* Password */}
          <Input
            name="password"
            type="password"
            placeholder="Password"
            formik={formik}
          />

          {/* Button */}
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
            {formik.isSubmitting ? "Logging in..." : "Login"}
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
          Dont have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="
            cursor-pointer
            font-semibold
            text-amber-500
            hover:text-amber-600
          "
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;

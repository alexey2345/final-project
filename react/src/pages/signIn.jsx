import Joi from "joi";
import { useFormik } from "formik";
import Input from "../components/common/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/auth.context";

function Login() {
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
  
  // Use the login function from your Auth Context
  const { login } = useAuth();

  const form = useFormik({
    validateOnMount: true,
    initialValues: {
      email: "",
      password: "",
    },
    validate(values) {
      const schema = Joi.object({
        email: Joi.string()
          .required()
          .email({ tlds: { allow: false } })
          .label("Email"),
        password: Joi.string().required().label("Password"),
      });

      const { error } = schema.validate(values, { abortEarly: false });
      if (!error) return null;

      const errors = {};
      for (const detail of error.details) {
        const key = detail.path.join(".");
        errors[key] = detail.message;
      }
      return errors;
    },
    async onSubmit(values) {
      try {
        await login(values); // Perform login
        navigate("/"); // Redirect to home page after login
      } catch (err) {
        if (err.response?.status === 400) {
          setServerError(err.response.data); // Display server error
        } else {
          setServerError("An unexpected error occurred. Please try again.");
        }
      }
    },
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "var(--background-color)",
        color: "var(--text-color)",
      }}
    >
      <h1 className="mx-5 mb-4 pt-4 pb-4" style={{ textAlign: "center", borderBottom: "2px solid black" }}>
        Login
      </h1>
      <form onSubmit={form.handleSubmit} style={{ width: "100%", maxWidth: "500px" }}>
        <Input
          {...form.getFieldProps("email")}
          label="Email"
          required
          placeholder="john.doe@example.com"
          error={form.touched.email && form.errors.email}
          type="email"
        />
        <Input
          {...form.getFieldProps("password")}
          label="Password"
          required
          placeholder="Your Password"
          error={form.touched.password && form.errors.password}
          type="password"
        />

        {serverError && <div className="alert alert-danger">{serverError}</div>}

        <button
          disabled={!form.isValid}
          className="btn btn-primary"
          type="submit"
          style={{ width: "100%", marginTop: "1rem" }}
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;

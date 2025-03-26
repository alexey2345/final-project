import Joi from "joi";
import { useFormik } from "formik";
import Input from "../components/common/input";
// import PageHeader from "../components/common/pageHeader";
// import usersService from "../services/usersService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/auth.context";
import { emailRegex, passwordRegex } from "../components/Regex";

function Signup() {
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  const { signUp } = useAuth();

  const form = useFormik({
    validateOnMount: true,
    initialValues: {
      name: {
        first: "",
        middle: "",
        last: "",
      },
      email: "",
      password: "",
      phone: "",
      address: {
        country: "",
        city: "",
        street: "",
        houseNumber: "",
        zip: "",
      },
      image: {
        url: "",
        alt: "",
      },
      biz: true,
    },
    validate(values) {
      const schema = Joi.object({
        name: Joi.object()
          .required()
          .keys({
            first: Joi.string().min(2).max(256).required().label("first"),
            middle: Joi.string().min(2).max(256).label("middle"),
            last: Joi.string().min(2).max(256).required().label("last"),
          }),
        email: Joi.string()
          .min(5)
          .required()
          .email({ tlds: { allow: false } })
          .label("Email")
          .pattern(emailRegex)
          .message("email must be a standard email"),

        password: Joi.string()
          .pattern(passwordRegex)
          .required()
          .label("Password")
          .messages({
            "string.pattern.base":
              "password must be at least nine characters long and contain an uppercase letter, a lowercase letter, a number and one of the following characters !@#$%^&*-",
          }),

        phone: Joi.string()
          .pattern(/^[0-9]{9,15}$/)
          .required()
          .label("Phone")
          .messages({
            "string.pattern.base":
              "Phone number must be between 9 and 10 digits.",
          }),
        address: Joi.object({
          country: Joi.string().min(2).max(256).required(),
          city: Joi.string().min(2).max(256).required(),
          street: Joi.string().min(2).max(256).required(),
          houseNumber: Joi.number().min(1).max(256).required(),
          zip: Joi.number().min(2).required(),
        }),
        image: Joi.object({
          url: Joi.string().min(14),
          alt: Joi.string().min(2).max(256),
        }),
        biz: Joi.boolean(),
      });

      const { error } = schema.validate(values, { abortEarly: false });
      if (!error) {
        return null;
      }

      const errors = {};
      for (const detail of error.details) {
        const key = detail.path.join(".");

        errors[key] = detail.message;
      }

      return errors;
    },
    async onSubmit(values) {
      try {
        const res = await signUp(values);
        console.log(res);
        navigate("/sign-in");
      } catch (err) {
        if (err.response?.status === 400) {
          setServerError(err.response.data);
          console.log(err.response.data);
        }
        console.log(err);
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
        padding: "20px",
      }}
    >
      <h1
        className="mb-4 pt-4 pb-4"
        style={{
          textAlign: "center",
          borderBottom: "2px solid black",
          width: "100%",
          maxWidth: "600px",
        }}
      >
        Sign Up
      </h1>

      <form
        onSubmit={form.handleSubmit}
        style={{
          width: "min(90vw, 600px)", // Responsive width
          display: "grid",
          gap: "15px",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          background: "#fff",
          padding: "25px",
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
        }}
      >
        {/* Name Fields */}
        <Input
          {...form.getFieldProps("name.first")}
          label="First Name"
          required
        />
        <Input {...form.getFieldProps("name.middle")} label="Middle Name" />
        <Input
          {...form.getFieldProps("name.last")}
          label="Last Name"
          required
        />

        {/* Email & Password */}
        <Input
          {...form.getFieldProps("email")}
          label="Email"
          required
          type="email"
        />
        <Input
          {...form.getFieldProps("password")}
          label="Password"
          required
          type="password"
        />

        {/* Phone */}
        <Input {...form.getFieldProps("phone")} label="Phone" required />

        {/* Address Fields */}
        <Input
          {...form.getFieldProps("address.country")}
          label="Country"
          required
        />
        <Input {...form.getFieldProps("address.city")} label="City" required />
        <Input
          {...form.getFieldProps("address.street")}
          label="Street"
          required
        />
        <Input
          {...form.getFieldProps("address.houseNumber")}
          label="House #"
          required
        />
        <Input
          {...form.getFieldProps("address.zip")}
          label="Zip Code"
          required
        />

        {/* Image Fields */}
        <Input
          {...form.getFieldProps("image.url")}
          label="Image URL"
          required
        />
        <Input
          {...form.getFieldProps("image.alt")}
          label="Image Alt Text"
          required
        />

        {/* Checkbox & Submit Button - Full Width */}
        <div
          style={{
            gridColumn: "1 / -1",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <input {...form.getFieldProps("biz")} type="checkbox" id="biz" />
          <label htmlFor="biz">Business Account</label>
        </div>

        {serverError && (
          <div className="alert alert-danger" style={{ gridColumn: "1 / -1" }}>
            {serverError}
          </div>
        )}

        <button
          disabled={!form.isValid}
          className="btn btn-primary"
          type="submit"
          style={{
            gridColumn: "1 / -1",
            padding: "12px",
            fontSize: "18px",
            borderRadius: "8px",
            cursor: "pointer",
            backgroundColor: "#007bff",
            border: "none",
            width: "100%",
          }}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default Signup;

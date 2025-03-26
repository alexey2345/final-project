import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import apiUrl from "../config.json";

function NewCardForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    phone: "",
    price: "",
    email: "",
    imageUrl: "",
    imageAlt: "",
    state: "",
    country: "",
    city: "",
    street: "",
    houseNumber: "",
    zip: "",
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const config = apiUrl;
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); // Get the token from local storage

    try {
      const requestData = {
        title: formData.title,
        description: formData.description,
        phone: formData.phone,
        price: formData.price,
        email: formData.email,
        image: {
          url: formData.imageUrl,
          alt: formData.imageAlt,
        },
        address: {
          state: formData.state,
          country: formData.country,
          city: formData.city,
          street: formData.street,
          houseNumber: formData.houseNumber,
          zip: formData.zip,
        },
      };

      const response = await axios.post(`${config.apiUrl}/cards`, requestData, {
        headers: {
          "x-auth-token": token, // Use the token from local storage
        },
      });
      console.log("Card created:", response.data);
      navigate("/"); // Redirect to homepage or a success page
    } catch (error) {
      console.error(
        "Error creating card:",
        error.response?.data || error.message,
      );
      setError("Failed to create card. Please try again.");
    }
  };

  return (
    <div className="container">
      <h1>Create a New Card</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            className="form-control"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input
            type="text"
            className="form-control"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>price</label>
          <input
            type="number"
            className="form-control"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Image url</label>
          <input
            type="text"
            className="form-control"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Image Alt Text</label>
          <input
            type="text"
            className="form-control"
            name="imageAlt"
            value={formData.imageAlt}
            onChange={handleChange}
          />
        </div>
        <h3>Address</h3>
        <div className="form-group">
          <label>State</label>
          <input
            type="text"
            className="form-control"
            name="state"
            value={formData.state}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Country</label>
          <input
            type="text"
            className="form-control"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>City</label>
          <input
            type="text"
            className="form-control"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Street</label>
          <input
            type="text"
            className="form-control"
            name="street"
            value={formData.street}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>House Number</label>
          <input
            type="number"
            className="form-control"
            name="houseNumber"
            value={formData.houseNumber}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>ZIP Code</label>
          <input
            type="number"
            className="form-control"
            name="zip"
            value={formData.zip}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Create Card
        </button>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </form>
    </div>
  );
}

export default NewCardForm;

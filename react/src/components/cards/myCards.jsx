import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/auth.context";
import config from "../../config.json";

function MyCards() {
  const [cards, setCards] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useAuth(); // Get the logged-in user
  const [editingCard, setEditingCard] = useState(null); // Store the card being edited
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
  }); // Form data for editing

  useEffect(() => {
    const fetchMyCards = async () => {
      if (!user) return; // Wait until the user is available

      const token = localStorage.getItem("token"); // Get the token from local storage
      console.log("Using token:", token); // Log the token

      try {
        const response = await axios.get(`${config.apiUrl}/cards/my-cards`, {
          headers: {
            "x-auth-token": token, // Use the token for the logged-in user
          },
        });

        console.log("Fetched cards:", response.data); // Log the fetched cards
        setCards(response.data); // Set the fetched cards directly
      } catch (err) {
        console.error("Error fetching my cards:", err);
        setError("Failed to fetch cards."); // Set error message if the fetch fails
      }
    };

    fetchMyCards();
  }, [user]);

  // Handle edit button click
  const handleEditClick = (card) => {
    setEditingCard(card); // Set the card to be edited
    setFormData({
      title: card.title,
      subtitle: card.subtitle,
      description: card.description,
    }); // Pre-fill form data
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value })); // Update form data
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const token = localStorage.getItem("token"); // Get the token

    try {
      const response = await axios.put(
        `${config.apiUrl}/cards/${editingCard._id}`,
        formData,
        {
          headers: {
            "x-auth-token": token, // Use the token for authorization
          },
        },
      );

      // Update the cards state with the updated card
      setCards((prevCards) =>
        prevCards.map((card) =>
          card._id === editingCard._id ? response.data : card,
        ),
      );
      setEditingCard(null); // Clear editing card
      setFormData({ title: "", subtitle: "", description: "" }); // Reset form data
    } catch (err) {
      console.error("Error updating card:", err);
      setError("Failed to update card."); // Set error message if the update fails
    }
  };

  // Handle card deletion
  // Handle card deletion
  const handleDeleteClick = async (cardId) => {
    if (!cardId) {
      console.error("Invalid card ID for deletion.");
      return;
    }

    const isConfirmed = window.confirm(
      "Are you sure you want to delete this card?",
    );

    if (!isConfirmed) return;

    const token = localStorage.getItem("token");

    try {
      const response = await axios.delete(`${config.apiUrl}/cards/${cardId}`, {
        headers: {
          "x-auth-token": token,
        },
      });

      if (response.status === 200) {
        setCards((prevCards) =>
          prevCards.filter((card) => card._id !== cardId),
        );
      }
    } catch (err) {
      console.error("Error deleting card:", err.response?.data || err.message);
      setError("Failed to delete card.");
    }
  };

  // Handle card liking
  const handleLikeClick = async (cardId) => {
    if (!cardId) {
      console.error("Invalid card ID for liking.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("User is not logged in.");
      setError("You must be logged in to like a card.");
      return;
    }

    try {
      const response = await axios.patch(
        `${config.apiUrl}/cards/${cardId}/like`, // ✅ Corrected route
        {},
        {
          headers: {
            "x-auth-token": token,
          },
        },
      );

      if (response.status === 200) {
        setCards((prevCards) =>
          prevCards.map((card) =>
            card._id === cardId ? { ...card, ...response.data } : card,
          ),
        );
      }
    } catch (err) {
      console.error("Error liking card:", err.response?.data || err.message);
      setError("Failed to like card.");
    }
  };

  return (
    <div className="container my-4">
      <h1>My Cards</h1>
      {error && <div className="alert alert-danger">{error}</div>}

      {editingCard ? (
        <div>
          <h2>Edit Card</h2>
          <form onSubmit={handleFormSubmit}>
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Subtitle</label>
              <input
                type="text"
                className="form-control"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">phone</label>
              <textarea
                className="form-control"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">email</label>
              <textarea
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">web</label>
              <textarea
                className="form-control"
                name="web"
                value={formData.web}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">image</label>
              <textarea
                className="form-control"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">web</label>
              <textarea
                className="form-control"
                name="web"
                value={formData.web}
                onChange={handleInputChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Update Card
            </button>
            <button
              type="button"
              className="btn btn-secondary ms-2"
              onClick={() => setEditingCard(null)}
            >
              Cancel
            </button>
          </form>
        </div>
      ) : (
        <div className="row">
          {cards.length > 0 ? (
            cards.map((card) => (
              <div key={card._id} className="col-md-4">
                <div className="card mb-4">
                  <img
                    src={card.image.url}
                    alt={card.image.alt || card.title} // Fallback to title if alt is not available
                    className="card-img-top"
                  />
                  <div className="card-body">
                    <h5 className="card-title">{card.title}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">
                      {card.subtitle}
                    </h6>
                    <p className="card-text">{card.description}</p>
                    <button
                      className="btn btn-warning"
                      onClick={() => handleEditClick(card)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger ms-2"
                      onClick={() => handleDeleteClick(card._id)}
                    >
                      Delete
                    </button>
                    <button
                      className="btn btn-success ms-2"
                      onClick={() => handleLikeClick(card._id)}
                    >
                      Like
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No cards found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default MyCards;

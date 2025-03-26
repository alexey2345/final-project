import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/auth.context";
import apiUrl from "../config.json";

const Favorites = () => {
  const [cards, setCards] = useState([]);
  const [currentPage] = useState(1);
  const [selectedCard, setSelectedCard] = useState(null);
  const cardsPerPage = 9;
  const { user } = useAuth();
  const config = apiUrl;

  // Fetch cards from API on component mount
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await axios.get("c");
        const fetchedCards = response.data.map((card) => ({
          ...card,
          isFavorite: card.likes.includes(user._id), // Mark as favorite if user has liked it
        }));
        setCards(fetchedCards);
      } catch (error) {
        console.error("Error fetching cards:", error);
      }
    };

    fetchCards();
  }, [user]);

  // Pagination logic
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = cards.slice(indexOfFirstCard, indexOfLastCard);

  // Handle card selection for modal
  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  const closeModal = () => {
    setSelectedCard(null);
  };

  // Toggle favorite status for the card
  const toggleFavorite = async (e, cardId) => {
    e.stopPropagation(); // Prevent modal from opening when clicking on heart

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Authentication token is missing.");
      return;
    }

    try {
      await axios.patch(
        `${config.apiUrl}/cards/${cardId}`,
        {},
        {
          headers: {
            "x-auth-token": token,
          },
        },
      );

      // Update the cards array by toggling the favorite status for the selected card
      setCards((prevCards) =>
        prevCards.map((card) =>
          card._id === cardId
            ? { ...card, isFavorite: !card.isFavorite }
            : card,
        ),
      );
    } catch (error) {
      alert("You can't like this card. Please connect to your user.");
    }
  };

  return (
    <div className="container my-4">
      <div className="row">
        {currentCards.map((card) => {
          const favoritesFilter = card.likes;
          if (favoritesFilter.includes(user._id))
            return (
              <div
                key={card._id}
                className="col-lg-4 col-md-6 mb-4 d-flex align-items-stretch"
                onClick={() => handleCardClick(card)}
              >
                <div className="card h-100">
                  <div
                    className="img-container"
                    style={{ height: "250px", overflow: "hidden" }}
                  >
                    <img
                      src={card.image.url}
                      className="card-img-top"
                      alt={card.title}
                      style={{
                        objectFit: "cover",
                        width: "400px",
                        height: "100%",
                      }}
                    />
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{card.title}</h5>
                    <p className="card-text">{card.subtitle}</p>
                    <p className="card-text">{card.description}</p>
                    <div className="mt-auto d-flex justify-content-between align-items-center">
                      <a href={`tel:${card.phone}`} className="btn btn-primary">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-telephone"
                          viewBox="0 0 16 16"
                        >
                          <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.48.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z" />
                        </svg>
                        Call
                      </a>
                      <button
                        className="btn"
                        onClick={(e) => toggleFavorite(e, card._id)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill={card.isFavorite ? "red" : "gray"} // Keep heart red when it's in favorites
                          className="bi bi-suit-heart-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M4 .8C4-.533 5.63-1 8 1.3 10.37-1 12 .467 12 2.467 12 4.267 8 8.2 8 8.2S4 4.267 4 2.467z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
        })}
      </div>

      {/* Modal for displaying card details */}
      {selectedCard && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedCard.title}</h5>
                <button
                  type="button"
                  className="btn-close ms-auto"
                  onClick={closeModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <img
                  src={selectedCard.image.url}
                  className="card-img-top mb-3"
                  alt={selectedCard.title}
                  style={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "400px",
                    objectFit: "contain",
                  }}
                />
                <p>{selectedCard.subtitle}</p>
                <p>{selectedCard.description}</p>
                <p>Phone: {selectedCard.phone}</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Favorites;

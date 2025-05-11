const express = require("express");
const router = express.Router();
const authMW = require("../middleware/auth");
const { validateCard, Card, generateListingNumber } = require("../model/cards");
const auth = require("../middleware/auth");

router.post("/", authMW, async (req, res) => {
  const { error } = validateCard(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  if (!req.user.biz) {
    res.status(400).send("user must be of type business to create a card");
    return;
  }

  const card = await new Card({
    ...req.body,
    bizImage:
      req.body.bizImage ??
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    user_id: req.user._id,
    listNumber: await generateListingNumber(),
  }).save();
  res.json(card);
});

router.get("/", async (req, res) => {
  try {
    // Fetch all cards from the database
    const cards = await Card.find();

    // Respond with the list of cards
    res.status(200).json(cards);
  } catch (err) {
    console.error("Error fetching cards:", err);
    res.status(500).send("Error fetching cards.");
  }
});

router.get("/my-cards", authMW, async (req, res) => {
  try {
    // Fetch cards created by the authenticated user
    const userCards = await Card.find({ user_id: req.user._id });

    // Respond with the user's cards
    res.status(200).json(userCards);
  } catch (err) {
    console.error("Error fetching user's cards:", err);
    res.status(500).send("Error fetching user's cards.");
  }
});

router.get("/my-cards/:id", authMW, async (req, res) => {
  try {
    const cardId = req.params.id;

    // Find the card by ID and ensure it belongs to the authenticated user
    const card = await Card.findOne({ _id: cardId, user_id: req.user._id });

    if (!card) {
      return res
        .status(404)
        .send("Card not found or does not belong to the user.");
    }

    // Respond with the card
    res.status(200).json(card);
  } catch (err) {
    console.error("Error fetching the card:", err);
    res.status(500).send("Error fetching the card.");
  }
});

// Route to edit a card created by the authenticated user
router.patch("/my-cards/:id", authMW, async (req, res) => {
  try {
    const cardId = req.params.id;

    // Validate the card data
    const { error } = validateCard(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    // Find the card and ensure it belongs to the authenticated user
    const card = await Card.findOne({ _id: cardId, user_id: req.user._id });
    if (!card) {
      return res
        .status(404)
        .send("Card not found or does not belong to the user.");
    }

    // Update the card fields
    Object.assign(card, req.body);
    await card.save();

    // Respond with the updated card
    res.status(200).json(card);
  } catch (err) {
    console.error("Error updating the card:", err);
    res.status(500).send("Error updating the card.");
  }
});

router.patch("/likes/:id", auth, async (req, res) => {
  console.log("Decoded JWT payload:", req.user); // ← you should see { id, name, role }
  const card = await Card.findById(req.params.id);
  if (!card) return res.status(404).send("Card not found");

  let username = req.user.name;
  if (!username && req.user.id) {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(400).send("User not found");
    username = user.name;
  }
  if (!username) return res.status(400).send("User name missing");

  // toggle like/unlike
  if (card.likes.includes(username)) {
    card.likes = card.likes.filter((u) => u !== username);
  } else {
    card.likes.push(username);
  }

  await card.save();
  res.send({ likes: card.likes });
});

router.patch("/listNumber/:id", authMW, async (req, res) => {
  const { listNumber } = req.body; // Get the new listNumber from the request body
  const cardId = req.params.id;

  // Check if the listNumber is provided
  if (!listNumber) {
    return res.status(400).send("New listNumber is required.");
  }

  try {
    // Find the card by ID and ensure it belongs to the authenticated user
    const card = await Card.findOne({ _id: cardId, user_id: req.user._id });
    if (!card) {
      return res
        .status(404)
        .send("Card not found or does not belong to the user.");
    }

    // Check if the new listNumber is already taken by another card
    const existingCard = await Card.findOne({ listNumber });
    if (existingCard && existingCard._id.toString() !== card._id.toString()) {
      return res
        .status(400)
        .send("The listNumber is already taken by another card.");
    }

    // Update the listNumber if it is unique
    card.listNumber = listNumber;
    await card.save();

    // Respond with the updated card
    res.status(200).json(card);
  } catch (err) {
    console.error("Error updating listNumber:", err);
    res.status(500).send("Error updating listNumber.");
  }
});

module.exports = router;

const Joi = require("joi");
const mongoose = require("mongoose");
const _ = require("lodash");

const cardsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  price: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  description: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 1024,
  },
  phone: {
    type: String,
    required: true,
    minlength: 9,
    maxlength: 11,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
  },
  image: {
    url: {
      type: String,
      required: false,
      minlength: 14,
    },
    alt: {
      type: String,
      required: false,
      minlength: 2,
      maxlength: 256,
    },
  },
  address: {
    state: {
      type: String,
      required: false,
      minlength: 2,
      maxlength: 256,
    },
    country: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 256,
    },
    city: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 256,
    },
    street: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 256,
    },
    houseNumber: {
      type: Number,
      required: true,
    },
    zip: {
      type: Number,
      required: true,
    },
  },
  listNumber: {
    type: Number,
    unique: true,
    required: true, // Ensure it's always set
    index: true,
  },
  likes: {
    type: Array,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: { type: Date, default: Date.now },
});

const Card = mongoose.model("Card", cardsSchema, "cards");

async function generateListingNumber() {
  while (true) {
    const random = _.random(100, 9_999_999_999);
    const card = await Card.findOne({ listNumber: random });
    if (!card) {
      return random;
    }
  }
}

async function createCard(cardData) {
  const listNumber = await generateListingNumber();
  const newCard = new Card({
    ...cardData,
    listNumber: listNumber, // Set the generated listNumber
  });

  try {
    await newCard.save();
    console.log(
      "Card created successfully with listNumber:",
      newCard.listNumber,
    );
  } catch (err) {
    console.error("Error creating card:", err.message);
    throw err;
  }
}

function validateCard(card) {
  const schema = Joi.object({
    title: Joi.string().min(2).max(255).required(),
    price: Joi.string().min(2).max(255).required(),
    description: Joi.string().min(2).max(1024).required(),
    phone: Joi.string().min(9).max(11).required(),
    email: Joi.string().min(5).required(),
    image: Joi.object({
      url: Joi.string().min(14).optional().allow(""),
      alt: Joi.string().min(2).max(256).optional().allow(""),
    }).optional(),
    address: Joi.object({
      state: Joi.string().min(2).max(256).optional().allow(""),
      country: Joi.string().min(2).max(256).required(),
      city: Joi.string().min(2).max(256).required(),
      street: Joi.string().min(2).max(256).required(),
      houseNumber: Joi.number().required(),
      zip: Joi.number().required(),
    }),
  });

  return schema.validate(card);
}

module.exports = { Card, validateCard, generateListingNumber, createCard };

// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/users");
const config = require("../config/config");

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).send("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).send("Invalid credentials");

  // ✅ Include user's name in token payload
  const token = jwt.sign(
    {
      id: user._id,
      name: User.name.,

      isAdmin: user.isAdmin,
      // 👈 Add this line
    },
    config.jwtKey,
    { expiresIn: "1h" },
  );

  res.json({ token });
};

module.exports = { login };

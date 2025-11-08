// cardCollectionAPI.js
const express = require("express");
const app = express();
const PORT = 3000;

// Middleware to parse JSON body
app.use(express.json());

// In-memory array to store cards
let cards = [];
let nextId = 1;

// GET all cards
app.get("/cards", (req, res) => {
  res.json(cards);
});

// GET a card by ID
app.get("/cards/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const card = cards.find(c => c.id === id);
  if (card) {
    res.json(card);
  } else {
    res.status(404).json({ message: "Card not found" });
  }
});

// POST a new card
app.post("/cards", (req, res) => {
  const { suit, value } = req.body;
  if (!suit || !value) {
    return res.status(400).json({ message: "Suit and value are required" });
  }
  const newCard = { id: nextId++, suit, value };
  cards.push(newCard);
  res.status(201).json(newCard);
});

// DELETE a card by ID
app.delete("/cards/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = cards.findIndex(c => c.id === id);
  if (index !== -1) {
    const removedCard = cards.splice(index, 1)[0];
    res.json({ message: "Card deleted", card: removedCard });
  } else {
    res.status(404).json({ message: "Card not found" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Card Collection API running at http://localhost:${PORT}`);
});

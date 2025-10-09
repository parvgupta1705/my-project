const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const PORT = 3000;
const SECRET_KEY = "mySecretKey123"; // In real apps, store this securely

// Mock user and balance
const user = {
  username: "user1",
  password: "password123",
};

let balance = 1000;

// Middleware to verify JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(403).json({ message: "Token required" });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
}

// Login route
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === user.username && password === user.password) {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// Protected routes
app.get("/balance", authenticateToken, (req, res) => {
  res.json({ balance });
});

app.post("/deposit", authenticateToken, (req, res) => {
  const { amount } = req.body;

  if (typeof amount !== "number" || amount <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  balance += amount;
  res.json({ message: `Deposited $${amount}`, newBalance: balance });
});

app.post("/withdraw", authenticateToken, (req, res) => {
  const { amount } = req.body;

  if (typeof amount !== "number" || amount <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  if (amount > balance) {
    return res.status(400).json({ message: "Insufficient balance" });
  }

  balance -= amount;
  res.json({ message: `Withdrew $${amount}`, newBalance: balance });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

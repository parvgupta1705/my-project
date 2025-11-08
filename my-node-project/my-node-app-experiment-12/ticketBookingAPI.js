// ticketBookingAPI.js
const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize seats (for example 10 seats)
let seats = [];
for (let i = 1; i <= 10; i++) {
  seats.push({ id: i, status: "available", lockedBy: null, lockExpires: null });
}

// Helper function to unlock expired seats
function unlockExpiredSeats() {
  const now = Date.now();
  seats.forEach(seat => {
    if (seat.status === "locked" && seat.lockExpires && seat.lockExpires < now) {
      seat.status = "available";
      seat.lockedBy = null;
      seat.lockExpires = null;
    }
  });
}

// GET available seats
app.get("/seats", (req, res) => {
  unlockExpiredSeats();
  const availableSeats = seats.filter(seat => seat.status === "available");
  res.json(availableSeats);
});

// POST lock a seat
app.post("/seats/lock", (req, res) => {
  unlockExpiredSeats();
  const { seatId, user } = req.body;
  const seat = seats.find(s => s.id === seatId);

  if (!seat) return res.status(404).json({ message: "Seat not found" });

  if (seat.status === "available") {
    seat.status = "locked";
    seat.lockedBy = user;
    seat.lockExpires = Date.now() + 60000; // lock for 1 minute
    res.json({ message: `Seat ${seatId} locked for ${user}` });
  } else if (seat.status === "locked") {
    res.status(400).json({ message: `Seat ${seatId} is already locked` });
  } else if (seat.status === "booked") {
    res.status(400).json({ message: `Seat ${seatId} is already booked` });
  }
});

// POST confirm booking
app.post("/seats/confirm", (req, res) => {
  unlockExpiredSeats();
  const { seatId, user } = req.body;
  const seat = seats.find(s => s.id === seatId);

  if (!seat) return res.status(404).json({ message: "Seat not found" });

  if (seat.status === "locked" && seat.lockedBy === user) {
    seat.status = "booked";
    seat.lockedBy = null;
    seat.lockExpires = null;
    res.json({ message: `Seat ${seatId} successfully booked by ${user}` });
  } else if (seat.status === "locked" && seat.lockedBy !== user) {
    res.status(400).json({ message: `Seat ${seatId} is locked by another user` });
  } else if (seat.status === "booked") {
    res.status(400).json({ message: `Seat ${seatId} is already booked` });
  } else {
    res.status(400).json({ message: `Seat ${seatId} is not locked by you` });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Ticket Booking API running at http://localhost:${PORT}`);
});


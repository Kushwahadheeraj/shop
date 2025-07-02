const express = require('express');
const router = express.Router();

// Dummy data for visitors chart
router.get('/visitors', (req, res) => {
  // Simulate 60 days of data
  const data = Array.from({ length: 60 }, (_, i) => ({
    date: new Date(Date.now() - (59 - i) * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    value: Math.floor(100 + Math.random() * 200)
  }));
  res.json(data);
});

// Dummy data for table
router.get('/documents', (req, res) => {
  res.json([
    { id: 1, header: "Cover page", type: "Cover page", status: "In Process", target: 13, link: "#", owner: "Eddie Lake" },
    { id: 2, header: "Table of contents", type: "Section", status: "Review", target: 54, link: "#", owner: "Eddie Lake" },
    { id: 3, header: "Executive summary", type: "Section", status: "In Process", target: 43, link: "#", owner: "Eddie Lake" },
  ]);
});

module.exports = router;

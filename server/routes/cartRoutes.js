const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Medicine = require('../models/Medicine');

// Get cart items for a user
router.get('/:userId', async (req, res) => {
  try {
    const cartItems = await Cart.find({ userId: req.params.userId }).populate('medicineId');
    res.json(cartItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

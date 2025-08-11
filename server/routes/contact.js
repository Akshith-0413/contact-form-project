// server/routes/contact.js
const express = require('express');
const router = express.Router();
const Message = require('../models/message');

router.post('/', async (req, res) => {
  try {
    console.log('📥 Received form data:', req.body);

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // ✅ Check for recent duplicate (same email+message within last 30 seconds)
    const thirtySecAgo = new Date(Date.now() - 30 * 1000);
    const recent = await Message.findOne({
      email,
      message,
      createdAt: { $gt: thirtySecAgo },
    });

    if (recent) {
      console.log('⚠️ Duplicate message detected, ignoring.');
      return res.status(409).json({ message: 'Duplicate message detected, try later' });
    }

    const doc = await Message.create({ name, email, message });

    console.log('✅ Saved to MongoDB:', {
      _id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      message: doc.message,
      createdAt: doc.createdAt
    });

    res.status(201).json({ message: 'Message saved successfully', id: doc._id });
  } catch (err) {
    console.error('❌ Error saving message:', err);
    res.status(500).json({ message: 'Failed to save message' });
  }
});

module.exports = router;
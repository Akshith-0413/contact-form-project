// server/routes/contact.js
const express = require('express');
const router = express.Router();
const Message = require('../models/message');

router.post('/', async (req, res) => {
  try {
    console.log('📥 Received form data:', req.body);   // <-- will show incoming payload

    const { name, email, message } = req.body;
    const doc = await Message.create({ name, email, message });

    console.log('✅ Saved to MongoDB:', {
      _id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      message: doc.message,
      createdAt: doc.createdAt || '(no timestamp field)'
    });                                              // <-- will show saved doc summary

    res.status(201).json({ message: 'Message saved successfully', id: doc._id });
  } catch (err) {
    console.error('❌ Error saving message:', err);
    res.status(500).json({ message: 'Failed to save message' });
  }
});

module.exports = router;
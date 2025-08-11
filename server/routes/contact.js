// server/routes/contact.js
const express = require('express');
const router = express.Router();
const Message = require('../models/message');
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

router.post('/', async (req, res) => {
  try {
    console.log('📥 Received form data:', req.body);

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // ✅ Block duplicates: same email+message in last 30s
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

    // Save to MongoDB
    const doc = await Message.create({ name, email, message });
    console.log('✅ Saved to MongoDB:', {
      _id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      message: doc.message,
      createdAt: doc.createdAt
    });

    // 📧 Send email notification (non-blocking for user experience)
    (async () => {
      try {
        const to = process.env.TO_EMAIL;
        const from = process.env.FROM_EMAIL || 'onboarding@resend.dev';

        if (!process.env.RESEND_API_KEY || !to) {
          console.warn('Resend not configured: missing RESEND_API_KEY or TO_EMAIL');
          return;
        }

        await resend.emails.send({
          from,
          to,
          reply_to: email, // so you can hit "Reply" to contact the sender
          subject: `New contact message from ${name}`,
          html: `
            <div style="font-family:system-ui,Segoe UI,Arial,sans-serif;line-height:1.6">
              <h2>New Contact Form Submission</h2>
              <p><strong>Name:</strong> ${escapeHtml(name)}</p>
              <p><strong>Email:</strong> ${escapeHtml(email)}</p>
              <p><strong>Message:</strong></p>
              <pre style="white-space:pre-wrap;background:#f7f7f7;padding:12px;border-radius:8px">${escapeHtml(message)}</pre>
              <hr>
              <p style="font-size:12px;color:#666">Message ID: ${doc._id}</p>
            </div>
          `,
          text: `New contact form submission:

Name: ${name}
Email: ${email}
Message:
${message}

Message ID: ${doc._id}
`
        });

        console.log('📧 Email notification sent via Resend');
      } catch (mailErr) {
        console.error('❌ Failed to send email via Resend:', mailErr);
      }
    })();

    // Respond to client immediately
    return res.status(201).json({ message: 'Message saved successfully', id: doc._id });
  } catch (err) {
    console.error('❌ Error saving message:', err);
    return res.status(500).json({ message: 'Failed to save message' });
  }
});

// simple HTML escape to avoid breaking the email markup
function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

module.exports = router;
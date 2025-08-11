import React, { useState } from 'react';
import './ContactForm.css';
import { motion } from 'framer-motion';
import { submitMessage } from "./api";

function App() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const themeClass = darkMode ? 'dark' : 'light';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (sending) return;            // prevent double-clicks
    setSending(true);
    try {
      await submitMessage(formData);

      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      console.error(err);
      // If our backend returns 409 (duplicate within 30s), submitMessage throws with status in message
      if (String(err.message).includes("409") || String(err.message).toLowerCase().includes("duplicate")) {
        alert("Please try again after a few seconds.");
      } else {
        alert("Something went wrong. Please try again.");
      }
    } finally {
      setSending(false);
    }
  }

  return (
    <div className={`main-container ${themeClass}`}>
      {submitted ? (
        <motion.div
          className="confirmation-message"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h2>✅ Message Sent!</h2>
          <p>Thank you for reaching out. I'll get back to you soon.</p>
        </motion.div>
      ) : (
        <>
          <motion.div
            className="form-container"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="theme-toggle">
              <label className="theme-switch">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                />
                <span className="slider"></span>
                <span className="switch-label">Dark Mode</span>
              </label>
            </div>

            <h1>Contact Form</h1>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={sending}   // lock inputs while sending
                />
              </div>

              <div>
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={sending}
                />
              </div>

              <div>
                <label>Message:</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  disabled={sending}
                />
              </div>

              <motion.button
                type="submit"
                disabled={sending}
                whileHover={!sending ? { scale: 1.05 } : {}}
                whileTap={!sending ? { scale: 0.95 } : {}}
                transition={{ duration: 0.2 }}
              >
                {sending ? "Sending..." : "Send Message"}
              </motion.button>
            </form>
          </motion.div>

          <div className="image-container">
            <img src="/undraw_contact-us_kcoa.svg" alt="Contact Illustration" />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
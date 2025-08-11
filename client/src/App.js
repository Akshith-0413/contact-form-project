import React, { useState } from 'react';
import './ContactForm.css';
import { motion } from 'framer-motion';

function App() {
  const [submitted, setSubmitted] = useState(false);
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
    try {
      await fetch('http://localhost:3000/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again.');
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
                />
              </div>

              <div>
                <label>Message:</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                Send Message
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
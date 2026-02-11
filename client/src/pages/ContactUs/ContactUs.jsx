import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import styles from "./ContactUs.module.css";

const ContactUs = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log("Contact form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 3000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className={styles.contactPage}>
      {/* Header */}
      <div className={styles.header}>
        <h1>{t("contact")}</h1>
        <p>We'd love to hear from you. Get in touch with Veloria Hotel.</p>
      </div>

      {/* Content */}
      <div className={styles.container}>
        {/* Contact Info */}
        <div className={styles.info}>
          <h3>Get in Touch</h3>
          
          <div className={styles.contactItem}>
            <div className={styles.iconBox}>📍</div>
            <div>
              <h4>Address</h4>
              <p>123 Luxury Avenue, Palestine</p>
            </div>
          </div>

          <div className={styles.contactItem}>
            <div className={styles.iconBox}>📞</div>
            <div>
              <h4>Phone</h4>
              <p>+970 59 000 0000</p>
            </div>
          </div>

          <div className={styles.contactItem}>
            <div className={styles.iconBox}>✉️</div>
            <div>
              <h4>Email</h4>
              <p>info@veloriahotel.com</p>
            </div>
          </div>

          <div className={styles.hours}>
            <h4>Working Hours</h4>
            <p>Reception: 24/7</p>
            <p>Restaurant: 6:00 AM - 11:00 PM</p>
            <p>Spa: 9:00 AM - 9:00 PM</p>
          </div>

          <div className={styles.social}>
            <h4>Follow Us</h4>
            <div className={styles.socialIcons}>
              <a href="#" aria-label="Facebook">📘</a>
              <a href="#" aria-label="Instagram">📷</a>
              <a href="#" aria-label="Twitter">🐦</a>
              <a href="#" aria-label="LinkedIn">💼</a>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <form className={styles.form} onSubmit={handleSubmit}>
          <h3>Send a Message</h3>

          {submitted && (
            <div className={styles.successMessage}>
              ✓ Message sent successfully! We'll get back to you soon.
            </div>
          )}

          <div className={styles.formGroup}>
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Inquiry about booking"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="6"
              placeholder="Your message here..."
              required
            ></textarea>
          </div>

          <button type="submit" className={styles.submitBtn}>
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;

import styles from "./ContactUs.module.css";

const ContactUs = () => {
  return (
    <div className={styles.contactPage}>
      {/* Header */}
      <div className={styles.header}>
        <h1>Contact Us</h1>
        <p>We’d love to hear from you. Get in touch with Veloria Hotel.</p>
      </div>

      {/* Content */}
      <div className={styles.container}>

        {/* Contact Info */}
        <div className={styles.info}>
          <h3>Get in Touch</h3>
          <p>📍 Palestine</p>
          <p>📞 +970 59 000 0000</p>
          <p>✉️ info@veloriahotel.com</p>

          <div className={styles.hours}>
            <h4>Working Hours</h4>
            <p>Monday – Sunday</p>
            <p>24 / 7</p>
          </div>
        </div>

        {/* Contact Form */}
        <form className={styles.form}>
          <h3>Send a Message</h3>

          <input
            type="text"
            placeholder="Full Name"
            required
          />

          <input
            type="email"
            placeholder="Email Address"
            required
          />

          <textarea
            rows="5"
            placeholder="Your Message"
            required
          ></textarea>

          <button type="submit">Send Message</button>
        </form>

      </div>
    </div>
  );
};

export default ContactUs;

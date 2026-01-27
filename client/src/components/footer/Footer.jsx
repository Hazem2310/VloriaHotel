import styles from "./footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Logo & Description */}
        <div className={styles.section}>
          <h2 className={styles.logo}>Veloria Hotel</h2>
          <p className={styles.text}>
            A luxury hotel experience focused on comfort, elegance, and modern
            design.
          </p>
        </div>

        {/* Quick Links */}
        <div className={styles.section}>
          <h4 className={styles.title}>Quick Links</h4>
          <ul className={styles.list}>
            <li>Rooms</li>
            <li>Restaurants</li>
            <li>Halls</li>
            <li>Contact Us</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className={styles.section}>
          <h4 className={styles.title}>Contact</h4>
          <p>📍 Palestine</p>
          <p>📞 +970 59 000 0000</p>
          <p>✉️ info@veloriahotel.com</p>
        </div>
      </div>

      <div className={styles.bottom}>
        © {new Date().getFullYear()} Veloria Hotel — All Rights Reserved
      </div>
    </footer>
  );
};

export default Footer;

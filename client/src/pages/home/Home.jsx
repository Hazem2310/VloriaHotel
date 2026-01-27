import styles from "./home.module.css";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.overlay}>
          <h1>Welcome to Veloria Hotel</h1>
          <p>Luxury, Comfort & Elegance in One Place</p>
          <Link to="/rooms" className={styles.btn}>
            Explore Rooms
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className={styles.about}>
        <h2>About Veloria</h2>
        <p>
          Veloria Hotel offers a premium experience combining modern design,
          comfort, and exceptional service. Whether you're here for business or
          relaxation, we provide everything you need.
        </p>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.card}>
          <h3>Luxury Rooms</h3>
          <p>Elegant rooms with modern amenities and stunning views.</p>
        </div>

        <div className={styles.card}>
          <h3>Fine Dining</h3>
          <p>Enjoy gourmet meals prepared by world-class chefs.</p>
        </div>

        <div className={styles.card}>
          <h3>Event Halls</h3>
          <p>Perfect halls for meetings, weddings, and special events.</p>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <h2>Ready to Book Your Stay?</h2>
        <Link to="/rooms" className={styles.btnSecondary}>
          Book Now
        </Link>
      </section>
    </div>
  );
};

export default Home;

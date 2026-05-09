import React from "react";
import { Link } from "react-router-dom";
import styles from "./home.module.css";

const Home = () => {
  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.heroVideo}></div>
          <div className={styles.heroOverlay}></div>
        </div>
        <div className={styles.heroContent}>
          <div className={styles.heroVisual}>
            <div className={styles.heroImage}>
              <img src="http://localhost:5000/uploads/homepage/luxurySpa.jpeg"  alt="Luxury Suite" />
            </div>
            <div className={styles.heroImage}>
              <img src="http://localhost:5000/uploads/homepage/hotel1.jpeg"  alt="Fine Dining" />
            </div>
            <div className={styles.heroImage}>
              <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" alt="Pool View" />
            </div>
          </div>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>Veloria</h1>
            <div className={styles.heroSubtitle}>Luxury Hotel</div>
            <div className={styles.heroActions}>
              <Link to="/rooms" className={styles.heroBtn}>
                Book Your Stay
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className={styles.about}>
        <div className={styles.aboutContainer}>
          <div className={styles.aboutContent}>
            <div className={styles.sectionBadge}>Our Story</div>
            <h2 className={styles.aboutTitle}>A Legacy of Excellence</h2>
            <p className={styles.aboutDescription}>
              Nestled in the heart of sophistication, Veloria Hotel embodies perfect harmony 
              between timeless elegance and contemporary luxury. Our commitment to exceptional 
              service and attention to detail creates an experience that transcends mere hospitality.
            </p>
            <p className={styles.aboutDescription}>
              Every aspect of Veloria has been meticulously crafted to ensure your stay is 
              nothing short of extraordinary, from our stunning architecture to our personalized 
              service that anticipates your every need.
            </p>
            <div className={styles.aboutStats}>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>50+</div>
                <div className={styles.statLabel}>Luxury Rooms</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>15+</div>
                <div className={styles.statLabel}>Years of Excellence</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>10k+</div>
                <div className={styles.statLabel}>Happy Guests</div>
              </div>
            </div>
          </div>
          <div className={styles.aboutImageWrapper}>
            <div className={styles.aboutImage}>
              <img src="http://localhost:5000/uploads/homepage/hotel1.jpeg"   alt="Luxury Hotel Interior" />
            </div>
            <div className={styles.aboutImageOverlay}></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.featuresHeader}>
          <div className={styles.sectionBadge}>Experiences</div>
          <h2 className={styles.featuresTitle}>Curated Luxury</h2>
          <p className={styles.featuresSubtitle}>
            Discover our carefully crafted experiences designed to exceed your expectations
          </p>
        </div>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureImageContainer}>
              <img src="http://localhost:5000/uploads/rooms/Junior Suite1.jpeg" alt="Luxury Suite" className={styles.featureImage} />
            </div>
            <div className={styles.featureContent}>
              <div className={styles.featureIcon}> suites</div>
              <h3 className={styles.featureTitle}>Luxury Suites</h3>
              <p className={styles.featureDescription}>
                Immerse yourself in sophisticated comfort with our meticulously designed suites, 
                featuring panoramic views and premium amenities
              </p>
              <Link to="/rooms" className={styles.featureLink}>Explore Suites</Link>
            </div>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureImageContainer}>
              <img src="http://localhost:5000/uploads/resturante/res1.jpeg" alt="Fine Dining" className={styles.featureImage} />
            </div>
            <div className={styles.featureContent}>
              <div className={styles.featureIcon}> dining</div>
              <h3 className={styles.featureTitle}>Gourmet Dining</h3>
              <p className={styles.featureDescription}>
                Savor exceptional culinary creations by our world-renowned chefs in an 
                atmosphere of refined elegance and impeccable service
              </p>
              <Link to="/gallery" className={styles.featureLink}>View Restaurant</Link>
            </div>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureImageContainer}>
              <img src="http://localhost:5000/uploads/halls/halls1.jpeg" alt="Event Space" className={styles.featureImage} />
            </div>
            <div className={styles.featureContent}>
              <div className={styles.featureIcon}> events</div>
              <h3 className={styles.featureTitle}>Grand Events</h3>
              <p className={styles.featureDescription}>
                Host unforgettable occasions in our stunning event spaces, where 
                every detail is perfectly orchestrated for your special moments
              </p>
              <Link to="/gallery" className={styles.featureLink}>Event Spaces</Link>
            </div>
          </div>
        </div>
      </section>

       {/* Amenities Section */}
      <section className={styles.amenities}>
        <div className={styles.amenitiesContainer}>
          <div className={styles.amenitiesHeader}>
            <div className={styles.sectionBadge}>Services</div>
            <h2 className={styles.amenitiesTitle}>Exceptional Amenities</h2>
            <p className={styles.amenitiesSubtitle}>
              Every detail thoughtfully considered to ensure your stay exceeds all expectations
            </p>
          </div>
          <div className={styles.amenitiesGrid}>
            <div className={styles.amenityCard}>
              <div className={styles.amenityImageContainer}>
                <img src="http://localhost:5000/uploads/homepage/Event Spaces.jpeg"  alt="Event Spaces" className={styles.amenityImage} onError={(e) => e.target.src = "https://images.unsplash.com/photo-1519167758480-ae77be5346ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"} />
              </div>
              <h4 className={styles.amenityTitle}>Event Spaces</h4>
              <p className={styles.amenityDescription}>Elegant venues for memorable occasions</p>
            </div>
            <div className={styles.amenityCard}>
              <div className={styles.amenityImageContainer}>
                <img src="http://localhost:5000/uploads/homepage/Gourmet Restaurant.jpeg" alt="Gourmet Restaurant" className={styles.amenityImage} onError={(e) => e.target.src = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"} />
              </div>
              <h4 className={styles.amenityTitle}>Gourmet Restaurant</h4>
              <p className={styles.amenityDescription}>Culinary excellence by world-class chefs</p>
            </div>
            <div className={styles.amenityCard}>
              <div className={styles.amenityImageContainer}>
                <img src="http://localhost:5000/uploads/homepage/luxurySpa.jpeg" alt="Luxury Spa" className={styles.amenityImage} onError={(e) => e.target.src = "https://images.unsplash.com/photo-1540555700478-4beac9c7bfc2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"} />
              </div>
              <h4 className={styles.amenityTitle}>Luxury Spa</h4>
              <p className={styles.amenityDescription}>Rejuvenating treatments in tranquil surroundings</p>
            </div>
            <div className={styles.amenityCard}>
              <div className={styles.amenityImageContainer}>
                <img src="http://localhost:5000/uploads/homepage/Fitness Center.png" alt="Fitness Center" className={styles.amenityImage} onError={(e) => e.target.src = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"} />
              </div>
              <h4 className={styles.amenityTitle}>Fitness Center</h4>
              <p className={styles.amenityDescription}>State-of-the-art equipment for your wellness</p>
            </div>
            <div className={styles.amenityCard}>
              <div className={styles.amenityImageContainer}>
                <img src="http://localhost:5000/uploads/homepage/Valet Parking.jpeg" alt="Valet Parking" className={styles.amenityImage} onError={(e) => e.target.src = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"} />
              </div>
              
              <h4 className={styles.amenityTitle}>Valet Parking</h4>
              <p className={styles.amenityDescription}>Complimentary secure parking service</p>
            </div>
            <div className={styles.amenityCard}>
              <div className={styles.amenityImageContainer}>
                <img src="http://localhost:5000/uploads/homepage/Premium WiFi.jpeg" alt="Premium WiFi" className={styles.amenityImage} onError={(e) => e.target.src = "https://images.unsplash.com/photo-1497366216548-314f8b1b0d81?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"} />
              </div>
              
              <h4 className={styles.amenityTitle}>Premium WiFi</h4>
              <p className={styles.amenityDescription}>High-speed connectivity throughout</p>
            </div>
            <div className={styles.amenityCard}>
              <div className={styles.amenityImageContainer}>
                <img src="http://localhost:5000/uploads/homepage/Concierge Service.jpeg" alt="Concierge Service" className={styles.amenityImage} onError={(e) => e.target.src = "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"} />
              </div>
              
              <h4 className={styles.amenityTitle}>Concierge Service</h4>
              <p className={styles.amenityDescription}>24/7 personalized assistance</p>
            </div>
            <div className={styles.amenityCard}>
              <div className={styles.amenityImageContainer}>
                <img src="/uploads/homepage/halls1.jpeg" alt="Infinity Pool" className={styles.amenityImage} onError={(e) => e.target.src = "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"} />
              </div>
              <h4 className={styles.amenityTitle}>Infinity Pool</h4>
              <p className={styles.amenityDescription}>Serene waters with breathtaking panoramic views</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { galleryAPI } from "../../Api/galleryApi";
import styles from "./home.module.css";
// import ImgUpload from "../../components/imgUpload/ImgUpload";

const Home = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGalleryPreview();
  }, []);

  const fetchGalleryPreview = async () => {
    try {
      setLoading(true);
      console.log("Fetching gallery preview...");
      
      // Get images from different categories for preview
      const roomsData = await galleryAPI.getByCategory("rooms");
      const restaurantsData = await galleryAPI.getByCategory("restaurants");
      const hallsData = await galleryAPI.getByCategory("halls");
      
      console.log("Rooms data:", roomsData);
      console.log("Restaurants data:", restaurantsData);
      console.log("Halls data:", hallsData);
      
      const previewImages = [
        // First room image
        ...(roomsData?.success && roomsData?.images?.length > 0 ? [roomsData.images[0]] : []),
        // First restaurant image
        ...(restaurantsData?.success && restaurantsData?.images?.length > 0 ? [restaurantsData.images[0]] : []),
        // First hall image
        ...(hallsData?.success && hallsData?.images?.length > 0 ? [hallsData.images[0]] : []),
        // Second room image if available
        ...(roomsData?.success && roomsData?.images?.length > 1 ? [roomsData.images[1]] : []),
      ].slice(0, 4); // Limit to 4 images
      
      console.log("Preview images:", previewImages);
      setGalleryImages(previewImages);
    } catch (error) {
      console.error("Error fetching gallery preview:", error);
      // Set empty array on error to prevent undefined issues
      setGalleryImages([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.overlay}>
          <h1>Where Elegance Meets Serenity</h1>
          <p>An Elevated Stay in the Heart of Luxury</p>
          <Link to="/rooms" className={styles.heroBtn}>
            Book Your Stay
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className={styles.about}>
        <div className={styles.aboutContent}>
          <h2>About Veloria</h2>
          <p>
            Veloria Hotel offers a premium experience combining modern design,
            comfort, and exceptional service. Whether you're here for business or
            relaxation, we provide everything you need.
          </p>
        </div>
        <div className={styles.aboutImage}></div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.card}>
          <div className={styles.cardImage}></div>
          <div className={styles.cardContent}>
            <h3>Luxury Rooms</h3>
            <p>Elegant rooms with modern amenities and stunning views.</p>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardImage}></div>
          <div className={styles.cardContent}>
            <h3>Fine Dining</h3>
            <p>Enjoy gourmet meals prepared by world-class chefs.</p>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardImage}></div>
          <div className={styles.cardContent}>
            <h3>Event Halls</h3>
            <p>Perfect halls for meetings, weddings, and special events.</p>
          </div>
        </div>
      </section>

       {/* Hotel Amenities Section */}
      <section className={styles.amenities}>
        <div className={styles.sectionHeader}>
          <h2>Hotel Amenities</h2>
          <p>Everything you need for a perfect stay</p>
        </div>
        <div className={styles.amenitiesGrid}>
          <div className={styles.amenityItem}>
            <span className={styles.amenityIcon}>🏊</span>
            <h4>Swimming Pool</h4>
            <p>Indoor and outdoor pools</p>
          </div>
          <div className={styles.amenityItem}>
            <span className={styles.amenityIcon}>🍽️</span>
            <h4>Restaurant</h4>
            <p>Fine dining experience</p>
          </div>
          <div className={styles.amenityItem}>
            <span className={styles.amenityIcon}>💆</span>
            <h4>Spa & Wellness</h4>
            <p>Relaxation treatments</p>
          </div>
          <div className={styles.amenityItem}>
            <span className={styles.amenityIcon}>🏋️</span>
            <h4>Fitness Center</h4>
            <p>Modern gym equipment</p>
          </div>
          <div className={styles.amenityItem}>
            <span className={styles.amenityIcon}>🅿️</span>
            <h4>Free Parking</h4>
            <p>Secure parking available</p>
          </div>
          <div className={styles.amenityItem}>
            <span className={styles.amenityIcon}>📶</span>
            <h4>Free WiFi</h4>
            <p>High-speed internet</p>
          </div>
          <div className={styles.amenityItem}>
            <span className={styles.amenityIcon}>🎉</span>
            <h4>Event Halls</h4>
            <p>Conference & wedding spaces</p>
          </div>
          <div className={styles.amenityItem}>
            <span className={styles.amenityIcon}>🚗</span>
            <h4>Airport Shuttle</h4>
            <p>Complimentary transfers</p>
          </div>
        </div>
      </section>
      

     
      {/* Special Offers Section */}
      <section className={styles.specialOffers}>
        <div className={styles.sectionHeader}>
          <h2>Special Offers</h2>
          <p>Exclusive deals for your perfect getaway</p>
        </div>
        <div className={styles.offersGrid}>
          <div className={styles.offerCard}>
            <div className={styles.offerBadge}>20% OFF</div>
            <h3>Summer Special</h3>
            <p>Book any room and get 20% off your stay</p>
            <div className={styles.offerPrice}>
              <span className={styles.offerOriginal}>$299</span>
              <span className={styles.offerCurrent}>$239</span>
              <span className={styles.offerPerNight}>/night</span>
            </div>
            <Link to="/rooms" className={styles.offerBtn}>Book Now</Link>
          </div>
          <div className={styles.offerCard}>
            <div className={styles.offerBadge}>FREE NIGHT</div>
            <h3>Weekend Package</h3>
            <p>Stay 2 nights, get 1 night free</p>
            <div className={styles.offerPrice}>
              <span className={styles.offerOriginal}>$599</span>
              <span className={styles.offerCurrent}>$399</span>
              <span className={styles.offerPerNight}>/2 nights</span>
            </div>
            <Link to="/rooms" className={styles.offerBtn}>Book Now</Link>
          </div>
          <div className={styles.offerCard}>
            <div className={styles.offerBadge}>DELUXE</div>
            <h3>Honeymoon Suite</h3>
            <p>Romantic package with champagne & flowers</p>
            <div className={styles.offerPrice}>
              <span className={styles.offerOriginal}>$499</span>
              <span className={styles.offerCurrent}>$449</span>
              <span className={styles.offerPerNight}>/night</span>
            </div>
            <Link to="/rooms" className={styles.offerBtn}>Book Now</Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonials}>
        <div className={styles.sectionHeader}>
          <h2>Guest Experiences</h2>
          <p>What our guests say about their stay</p>
        </div>
        <div className={styles.testimonialsGrid}>
          <div className={styles.testimonialCard}>
            <div className={styles.testimonialQuote}>
              "An unforgettable experience. The attention to detail and impeccable service exceeded all expectations."
            </div>
            <div className={styles.testimonialAuthor}>
              <span className={styles.testimonialName}>Sarah M.</span>
              <span className={styles.testimonialLocation}>New York, USA</span>
            </div>
          </div>
          <div className={styles.testimonialCard}>
            <div className={styles.testimonialQuote}>
              "Pure luxury from the moment we arrived. The spa and dining were exceptional. Will definitely return."
            </div>
            <div className={styles.testimonialAuthor}>
              <span className={styles.testimonialName}>James L.</span>
              <span className={styles.testimonialLocation}>London, UK</span>
            </div>
          </div>
          <div className={styles.testimonialCard}>
            <div className={styles.testimonialQuote}>
              "The perfect blend of elegance and comfort. Our anniversary celebration was magical thanks to the staff."
            </div>
            <div className={styles.testimonialAuthor}>
              <span className={styles.testimonialName}>Emma & David</span>
              <span className={styles.testimonialLocation}>Paris, France</span>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery Preview Section */}
      <section className={styles.galleryPreview}>
        <div className={styles.sectionHeader}>
          <h2>Visual Journey</h2>
          <p>A glimpse into our world of luxury</p>
        </div>
        <div className={styles.galleryGrid}>
          <div className={styles.galleryItem}>
            <div className={styles.galleryImage}>
              {galleryImages[0] ? (
                <img 
                  src={galleryImages[0].url || galleryImages[0].imageUrl || `/uploads/${galleryImages[0].filename}`} 
                  alt="Luxury Rooms" 
                  onError={(e) => {
                    console.log("Image 1 failed to load:", galleryImages[0]);
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className={styles.imagePlaceholder} style={{display: galleryImages[0] ? 'none' : 'flex'}}>
                Luxury Rooms
              </div>
            </div>
            <div className={styles.galleryOverlay}>
              <span className={styles.galleryLabel}>Luxury Rooms</span>
            </div>
          </div>
          <div className={styles.galleryItem}>
            <div className={styles.galleryImage}>
              {galleryImages[1] ? (
                <img 
                  src={galleryImages[1].url || galleryImages[1].imageUrl || `/uploads/${galleryImages[1].filename}`} 
                  alt="Fine Dining"
                  onError={(e) => {
                    console.log("Image 2 failed to load:", galleryImages[1]);
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className={styles.imagePlaceholder} style={{display: galleryImages[1] ? 'none' : 'flex'}}>
                Fine Dining
              </div>
            </div>
            <div className={styles.galleryOverlay}>
              <span className={styles.galleryLabel}>Fine Dining</span>
            </div>
          </div>
          <div className={styles.galleryItem}>
            <div className={styles.galleryImage}>
              {galleryImages[2] ? (
                <img 
                  src={galleryImages[2].url || galleryImages[2].imageUrl || `/uploads/${galleryImages[2].filename}`} 
                  alt="Spa & Wellness"
                  onError={(e) => {
                    console.log("Image 3 failed to load:", galleryImages[2]);
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className={styles.imagePlaceholder} style={{display: galleryImages[2] ? 'none' : 'flex'}}>
                Spa & Wellness
              </div>
            </div>
            <div className={styles.galleryOverlay}>
              <span className={styles.galleryLabel}>Spa & Wellness</span>
            </div>
          </div>
          <div className={styles.galleryItem}>
            <div className={styles.galleryImage}>
              {galleryImages[3] ? (
                <img 
                  src={galleryImages[3].url || galleryImages[3].imageUrl || `/uploads/${galleryImages[3].filename}`} 
                  alt="Event Spaces"
                  onError={(e) => {
                    console.log("Image 4 failed to load:", galleryImages[3]);
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className={styles.imagePlaceholder} style={{display: galleryImages[3] ? 'none' : 'flex'}}>
                Event Spaces
              </div>
            </div>
            <div className={styles.galleryOverlay}>
              <span className={styles.galleryLabel}>Event Spaces</span>
            </div>
          </div>
        </div>
        <div className={styles.galleryCta}>
          <Link to="/gallery" className={styles.galleryBtn}>View Full Gallery</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

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
        <div className={styles.heroBackground}>
          <div className={styles.heroVideo}></div>
          <div className={styles.heroOverlay}></div>
        </div>
        <div className={styles.heroContent}>
          <div className={styles.heroVisual}>
            <div className={styles.heroImage}>
              <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" alt="Luxury Suite" />
            </div>
            <div className={styles.heroImage}>
              <img src="https://images.unsplash.com/photo-1551882547-ff40c63e577b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" alt="Fine Dining" />
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
              Nestled in the heart of sophistication, Veloria Hotel embodies the perfect harmony 
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
              <img src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" alt="Luxury Hotel Interior" />
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
              <img src="https://images.unsplash.com/photo-1611892440507-42b07dbd4859?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" alt="Luxury Suite" className={styles.featureImage} />
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
              <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" alt="Fine Dining" className={styles.featureImage} />
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
              <img src="https://images.unsplash.com/photo-1519167758480-ae77be5346ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" alt="Event Space" className={styles.featureImage} />
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
                <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" alt="Infinity Pool" className={styles.amenityImage} />
              </div>
              <div className={styles.amenityIcon}>?</div>
              <h4 className={styles.amenityTitle}>Infinity Pool</h4>
              <p className={styles.amenityDescription}>Serene waters with breathtaking panoramic views</p>
            </div>
            <div className={styles.amenityCard}>
              <div className={styles.amenityImageContainer}>
                <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" alt="Restaurant" className={styles.amenityImage} />
              </div>
              <div className={styles.amenityIcon}>?</div>
              <h4 className={styles.amenityTitle}>Gourmet Restaurant</h4>
              <p className={styles.amenityDescription}>Culinary excellence by world-class chefs</p>
            </div>
            <div className={styles.amenityCard}>
              <div className={styles.amenityImageContainer}>
                <img src="https://images.unsplash.com/photo-1540555700478-4beac9c7bfc2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" alt="Spa" className={styles.amenityImage} />
              </div>
              <div className={styles.amenityIcon}>?</div>
              <h4 className={styles.amenityTitle}>Luxury Spa</h4>
              <p className={styles.amenityDescription}>Rejuvenating treatments in tranquil surroundings</p>
            </div>
            <div className={styles.amenityCard}>
              <div className={styles.amenityImageContainer}>
                <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" alt="Fitness Center" className={styles.amenityImage} />
              </div>
              <div className={styles.amenityIcon}>?</div>
              <h4 className={styles.amenityTitle}>Fitness Center</h4>
              <p className={styles.amenityDescription}>State-of-the-art equipment for your wellness</p>
            </div>
            <div className={styles.amenityCard}>
              <div className={styles.amenityImageContainer}>
                <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" alt="Parking" className={styles.amenityImage} />
              </div>
              <div className={styles.amenityIcon}>?</div>
              <h4 className={styles.amenityTitle}>Valet Parking</h4>
              <p className={styles.amenityDescription}>Complimentary secure parking service</p>
            </div>
            <div className={styles.amenityCard}>
              <div className={styles.amenityImageContainer}>
                <img src="https://images.unsplash.com/photo-1497366216548-314f8b1b0d81?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" alt="WiFi" className={styles.amenityImage} />
              </div>
              <div className={styles.amenityIcon}>?</div>
              <h4 className={styles.amenityTitle}>Premium WiFi</h4>
              <p className={styles.amenityDescription}>High-speed connectivity throughout</p>
            </div>
            <div className={styles.amenityCard}>
              <div className={styles.amenityImageContainer}>
                <img src="https://images.unsplash.com/photo-1519167758480-ae77be5346ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" alt="Event Spaces" className={styles.amenityImage} />
              </div>
              <div className={styles.amenityIcon}>?</div>
              <h4 className={styles.amenityTitle}>Event Spaces</h4>
              <p className={styles.amenityDescription}>Elegant venues for memorable occasions</p>
            </div>
            <div className={styles.amenityCard}>
              <div className={styles.amenityImageContainer}>
                <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" alt="Concierge" className={styles.amenityImage} />
              </div>
              <div className={styles.amenityIcon}>?</div>
              <h4 className={styles.amenityTitle}>Concierge Service</h4>
              <p className={styles.amenityDescription}>24/7 personalized assistance</p>
            </div>
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

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { galleryAPI } from "../../Api/galleryApi";
import styles from "./home.module.css";

const API_BASE = "http://localhost:5000";

const fallbackImage =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80";

const getImageUrl = (img) => {
  if (!img) return "";

  if (typeof img === "string") {
    return img.startsWith("http") ? img : `${API_BASE}${img.startsWith("/") ? img : `/${img}`}`;
  }

  const src =
    img.url ||
    img.imageUrl ||
    img.image_url ||
    img.imagePath ||
    img.image_path ||
    img.file_path ||
    img.filePath ||
    img.path ||
    img.filename ||
    img.file_name ||
    img.name ||
    img.image ||
    "";

  if (!src) return "";
  if (src.startsWith("http")) return src;

  const cleanSrc = String(src).replace(/^\/+/, "");
  return `${API_BASE}/${cleanSrc.startsWith("uploads") ? cleanSrc : `uploads/${cleanSrc}`}`;
};

const getImagesArray = (data) => {
  if (!data) return [];
  if (Array.isArray(data.images) && data.images[0]?.images) return data.images[0].images;
  if (Array.isArray(data.images)) return data.images;
  if (Array.isArray(data.data?.images)) return data.data.images;
  if (Array.isArray(data.category?.images)) return data.category.images;
  if (Array.isArray(data.result?.images)) return data.result.images;
  return [];
};

const heroImages = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1551882547-ff40c63e577b?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=900&q=80",
];

const amenities = [
  {
    icon: "🏊",
    title: "Infinity Pool",
    desc: "Serene waters with breathtaking panoramic views",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=700&q=80",
  },
  {
    icon: "🍽️",
    title: "Gourmet Restaurant",
    desc: "Culinary excellence by world-class chefs",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=700&q=80",
  },
  {
    icon: "💆",
    title: "Luxury Spa",
    desc: "Rejuvenating treatments in tranquil surroundings",
    image: "https://images.unsplash.com/photo-1540555700478-4beac9c7bfc2?auto=format&fit=crop&w=700&q=80",
  },
  {
    icon: "🏋️",
    title: "Fitness Center",
    desc: "State-of-the-art equipment for your wellness",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=700&q=80",
  },
  {
    icon: "🚗",
    title: "Valet Parking",
    desc: "Complimentary secure parking service",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=700&q=80",
  },
  {
    icon: "📶",
    title: "Premium WiFi",
    desc: "High-speed connectivity throughout",
    image: "https://images.unsplash.com/photo-1497366216548-314f8b1b0d81?auto=format&fit=crop&w=700&q=80",
  },
  {
    icon: "🏛️",
    title: "Event Spaces",
    desc: "Elegant venues for memorable occasions",
    image: "https://images.unsplash.com/photo-1519167758480-ae77be5346ff?auto=format&fit=crop&w=700&q=80",
  },
  {
    icon: "🛎️",
    title: "Concierge Service",
    desc: "24/7 personalized assistance",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=700&q=80",
  },
];

const Home = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGalleryPreview();
  }, []);

  const fetchGalleryPreview = async () => {
    try {
      setLoading(true);

      const roomsData = await galleryAPI.getByCategory("rooms");
      const restaurantsData = await galleryAPI.getByCategory("restaurants");
      const hallsData = await galleryAPI.getByCategory("halls");

      const roomsImages = getImagesArray(roomsData);
      const restaurantsImages = getImagesArray(restaurantsData);
      const hallsImages = getImagesArray(hallsData);

      const previewImages = [
        roomsImages[0],
        restaurantsImages[0],
        hallsImages[0],
        roomsImages[1],
      ].filter(Boolean);

      setGalleryImages(previewImages);
    } catch (error) {
      console.error("Error fetching gallery preview:", error);
      setGalleryImages([]);
    } finally {
      setLoading(false);
    }
  };

  const renderGalleryImage = (index, label) => {
    const imageSrc = getImageUrl(galleryImages[index]);

    return (
      <div className={styles.galleryItem} key={label}>
        <div className={styles.galleryImage}>
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={label}
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.nextElementSibling.style.display = "flex";
              }}
            />
          ) : null}

          <div
            className={styles.imagePlaceholder}
            style={{ display: imageSrc ? "none" : "flex" }}
          >
            {loading ? "Loading..." : label}
          </div>
        </div>

        <div className={styles.galleryOverlay}>
          <span className={styles.galleryLabel}>{label}</span>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.heroVideo}></div>
          <div className={styles.heroOverlay}></div>
        </div>

        <div className={styles.heroContent}>
          <div className={styles.heroVisual}>
            {heroImages.map((src, index) => (
              <div className={styles.heroImage} key={src}>
                <img
                  src={src}
                  alt={`Veloria Hotel ${index + 1}`}
                  onError={(e) => {
                    e.currentTarget.src = fallbackImage;
                  }}
                />
              </div>
            ))}
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

      <section className={styles.about}>
        <div className={styles.aboutContainer}>
          <div className={styles.aboutContent}>
            <div className={styles.sectionBadge}>Our Story</div>
            <h2 className={styles.aboutTitle}>A Legacy of Excellence</h2>
            <p className={styles.aboutDescription}>
              Nestled in the heart of sophistication, Veloria Hotel embodies the perfect harmony
              between timeless elegance and contemporary luxury.
            </p>
            <p className={styles.aboutDescription}>
              Every aspect of Veloria has been meticulously crafted to ensure your stay is
              nothing short of extraordinary.
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
              <img
                src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1000&q=80"
                alt="Luxury Hotel Interior"
                onError={(e) => {
                  e.currentTarget.src = fallbackImage;
                }}
              />
            </div>
            <div className={styles.aboutImageOverlay}></div>
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <div className={styles.featuresHeader}>
          <div className={styles.sectionBadge}>Experiences</div>
          <h2 className={styles.featuresTitle}>Curated Luxury</h2>
          <p className={styles.featuresSubtitle}>
            Discover our carefully crafted experiences designed to exceed your expectations.
          </p>
        </div>

        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureImageContainer}>
              <img src={heroImages[0]} alt="Luxury Suite" className={styles.featureImage} />
            </div>
            <div className={styles.featureContent}>
              <div className={styles.featureIcon}>🏨</div>
              <h3 className={styles.featureTitle}>Luxury Suites</h3>
              <p className={styles.featureDescription}>
                Sophisticated comfort with panoramic views and premium amenities.
              </p>
              <Link to="/rooms" className={styles.featureLink}>Explore Suites</Link>
            </div>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureImageContainer}>
              <img src={heroImages[1]} alt="Fine Dining" className={styles.featureImage} />
            </div>
            <div className={styles.featureContent}>
              <div className={styles.featureIcon}>🍽️</div>
              <h3 className={styles.featureTitle}>Gourmet Dining</h3>
              <p className={styles.featureDescription}>
                Exceptional culinary creations in a refined atmosphere.
              </p>
              <Link to="/gallery" className={styles.featureLink}>View Restaurant</Link>
            </div>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureImageContainer}>
              <img src={heroImages[2]} alt="Event Space" className={styles.featureImage} />
            </div>
            <div className={styles.featureContent}>
              <div className={styles.featureIcon}>🏛️</div>
              <h3 className={styles.featureTitle}>Grand Events</h3>
              <p className={styles.featureDescription}>
                Stunning event spaces where every detail is perfectly arranged.
              </p>
              <Link to="/gallery" className={styles.featureLink}>Event Spaces</Link>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.amenities}>
        <div className={styles.amenitiesContainer}>
          <div className={styles.amenitiesHeader}>
            <div className={styles.sectionBadge}>Services</div>
            <h2 className={styles.amenitiesTitle}>Exceptional Amenities</h2>
            <p className={styles.amenitiesSubtitle}>
              Every detail thoughtfully considered to ensure your stay exceeds all expectations.
            </p>
          </div>

          <div className={styles.amenitiesGrid}>
            {amenities.map((item) => (
              <div className={styles.amenityCard} key={item.title}>
                <div className={styles.amenityImageContainer}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className={styles.amenityImage}
                    onError={(e) => {
                      e.currentTarget.src = fallbackImage;
                    }}
                  />
                </div>
                <div className={styles.amenityIcon}>{item.icon}</div>
                <h4 className={styles.amenityTitle}>{item.title}</h4>
                <p className={styles.amenityDescription}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.specialOffers}>
        <div className={styles.sectionHeader}>
          <h2>Special Offers</h2>
          <p>Exclusive deals for your perfect getaway</p>
        </div>

        <div className={styles.offersGrid}>
          {[
            ["20% OFF", "Summer Special", "Book any room and get 20% off your stay", "$299", "$239", "/night"],
            ["FREE NIGHT", "Weekend Package", "Stay 2 nights, get 1 night free", "$599", "$399", "/2 nights"],
            ["DELUXE", "Honeymoon Suite", "Romantic package with champagne & flowers", "$499", "$449", "/night"],
          ].map(([badge, title, desc, oldPrice, price, night]) => (
            <div className={styles.offerCard} key={title}>
              <div className={styles.offerBadge}>{badge}</div>
              <h3>{title}</h3>
              <p>{desc}</p>
              <div className={styles.offerPrice}>
                <span className={styles.offerOriginal}>{oldPrice}</span>
                <span className={styles.offerCurrent}>{price}</span>
                <span className={styles.offerPerNight}>{night}</span>
              </div>
              <Link to="/rooms" className={styles.offerBtn}>Book Now</Link>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.testimonials}>
        <div className={styles.sectionHeader}>
          <h2>Guest Experiences</h2>
          <p>What our guests say about their stay</p>
        </div>

        <div className={styles.testimonialsGrid}>
          {[
            ["Sarah M.", "New York, USA", "An unforgettable experience. The service exceeded all expectations."],
            ["James L.", "London, UK", "Pure luxury from the moment we arrived. Will definitely return."],
            ["Emma & David", "Paris, France", "The perfect blend of elegance and comfort."],
          ].map(([name, location, quote]) => (
            <div className={styles.testimonialCard} key={name}>
              <div className={styles.testimonialQuote}>"{quote}"</div>
              <div className={styles.testimonialAuthor}>
                <span className={styles.testimonialName}>{name}</span>
                <span className={styles.testimonialLocation}>{location}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.galleryPreview}>
        <div className={styles.sectionHeader}>
          <h2>Visual Journey</h2>
          <p>A glimpse into our world of luxury</p>
        </div>

        <div className={styles.galleryGrid}>
          {renderGalleryImage(0, "Luxury Rooms")}
          {renderGalleryImage(1, "Fine Dining")}
          {renderGalleryImage(2, "Spa & Wellness")}
          {renderGalleryImage(3, "Event Spaces")}
        </div>

        <div className={styles.galleryCta}>
          <Link to="/gallery" className={styles.galleryBtn}>
            View Full Gallery
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
import React, { useState, useEffect } from "react";
import { galleryAPI } from "../../Api/galleryApi";
import styles from "./Gallery.module.css";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState("");

  const categories = [
    { id: "all", name: "All Images", icon: "🖼️" },
    { id: "rooms", name: "Rooms", icon: "🏨" },
    { id: "halls", name: "Halls", icon: "🎉" },
    { id: "restaurants", name: "Restaurants", icon: "🍽️" },
  ];

  useEffect(() => {
    fetchGalleryImages();
    fetchGalleryStats();
  }, [selectedCategory]);

  const fetchGalleryImages = async () => {
    try {
      setLoading(true);
      const data = selectedCategory === "all" 
        ? await galleryAPI.getAll()
        : await galleryAPI.getByCategory(selectedCategory);
      
      if (data.success) {
        setImages(data.images);
      } else {
        setError("Failed to load gallery images");
      }
    } catch (error) {
      console.error("Error fetching gallery images:", error);
      setError("Failed to load gallery images");
    } finally {
      setLoading(false);
    }
  };

  const fetchGalleryStats = async () => {
    try {
      const data = await galleryAPI.getStats();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching gallery stats:", error);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/placeholder-image.jpg";
    
    // If imagePath is an object with url property, use that
    if (typeof imagePath === 'object' && imagePath.url) {
      return imagePath.url;
    }
    
    // If it's a string, process it
    if (typeof imagePath === 'string') {
      // If it's already a full URL, return as is
      if (imagePath.startsWith("http")) return imagePath;
      // Otherwise, prepend the server URL
      return `http://localhost:5000${imagePath}`;
    }
    
    // Fallback
    return "/placeholder-image.jpg";
  };

  const openLightbox = (image, imageIndex) => {
    setSelectedImage({
      ...image,
      currentIndex: imageIndex,
      allImages: image.images
    });
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction) => {
    if (!selectedImage) return;
    
    const { currentIndex, allImages } = selectedImage;
    let newIndex;
    
    if (direction === "next") {
      newIndex = currentIndex < allImages.length - 1 ? currentIndex + 1 : 0;
    } else {
      newIndex = currentIndex > 0 ? currentIndex - 1 : allImages.length - 1;
    }
    
    setSelectedImage({
      ...selectedImage,
      currentIndex: newIndex
    });
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading gallery...</p>
      </div>
    );
  }

  return (
    <div className={styles.galleryContainer}>
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Veloria Gallery</h1>
          <p className={styles.heroSubtitle}>Experience the luxury and elegance through our visual journey</p>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNumber}>{stats.total || 0}</span>
              <span className={styles.heroStatLabel}>Stunning Images</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNumber}>{categories.length - 1}</span>
              <span className={styles.heroStatLabel}>Categories</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNumber}>★</span>
              <span className={styles.heroStatLabel}>Premium Quality</span>
            </div>
          </div>
        </div>
        <div className={styles.heroBackground}>
          <div className={styles.heroOverlay}></div>
        </div>
      </div>

      {/* Enhanced Category Section */}
      <div className={styles.categorySection}>
        <div className={styles.categoryHeader}>
          <h2 className={styles.categoryTitle}>Browse by Category</h2>
          <p className={styles.categoryDescription}>Discover our spaces through curated collections</p>
        </div>
        
        <div className={styles.categoryTabs}>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`${styles.categoryTab} ${
                selectedCategory === category.id ? styles.active : ""
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <div className={styles.categoryIconWrapper}>
                <span className={styles.categoryIcon}>{category.icon}</span>
              </div>
              <div className={styles.categoryContent}>
                <span className={styles.categoryName}>{category.name}</span>
                {stats[category.id] !== undefined && (
                  <span className={styles.categoryCount}>{stats[category.id]} images</span>
                )}
              </div>
              {selectedCategory === category.id && (
                <div className={styles.categoryIndicator}></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className={styles.errorContainer}>
          <p>{error}</p>
        </div>
      )}

      {/* Gallery Grid */}
      {images.length === 0 && !loading ? (
        <div className={styles.noImages}>
          <p>No images available for this category.</p>
        </div>
      ) : (
        <div className={styles.galleryGrid}>
          {images.map((item) => (
            <div key={`${item.category}-${item.id}`} className={styles.galleryItem}>
              <div className={styles.itemHeader}>
                <h3 className={styles.itemTitle}>{item.title}</h3>
                <span className={styles.categoryBadge}>
                  {categories.find(c => c.id === item.category)?.icon} {item.category}
                </span>
              </div>
              
              {item.subtitle && (
                <p className={styles.itemSubtitle}>{item.subtitle}</p>
              )}

              <div className={styles.imageGrid}>
                {item.images.map((image, index) => (
                  <div
                    key={index}
                    className={styles.imageContainer}
                    onClick={() => openLightbox(item, index)}
                  >
                    <img
                      src={getImageUrl(image)}
                      alt={`${item.title} - ${index + 1}`}
                      className={styles.galleryImage}
                      onError={(e) => {
                        e.target.src = "/placeholder-image.jpg";
                      }}
                    />
                    <div className={styles.imageOverlay}>
                      <span className={styles.viewIcon}>🔍</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {selectedImage && (
        <div className={styles.lightbox} onClick={closeLightbox}>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={closeLightbox}>
              ✕
            </button>
            
            <button
              className={`${styles.navBtn} ${styles.prevBtn}`}
              onClick={() => navigateImage("prev")}
            >
              ‹
            </button>
            
            <img
              src={getImageUrl(selectedImage.allImages[selectedImage.currentIndex])}
              alt={`${selectedImage.title} - ${selectedImage.currentIndex + 1}`}
              className={styles.lightboxImage}
            />
            
            <button
              className={`${styles.navBtn} ${styles.nextBtn}`}
              onClick={() => navigateImage("next")}
            >
              ›
            </button>
            
            <div className={styles.lightboxInfo}>
              <h3>{selectedImage.title}</h3>
              <p>
                {selectedImage.currentIndex + 1} / {selectedImage.allImages.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;

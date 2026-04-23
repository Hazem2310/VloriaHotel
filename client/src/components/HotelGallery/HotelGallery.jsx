import React, { useState, useEffect } from "react";
import styles from "./HotelGallery.module.css";

const HotelGallery = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [lightboxImage, setLightboxImage] = useState(null);
  const [filteredImages, setFilteredImages] = useState([]);

  // Gallery data with categories
  const galleryImages = [
    {
      id: 1,
      src: "http://localhost:5000/uploads/halls/halls1.jpeg",
      category: "halls",
      title: "Grand Ballroom",
      alt: "Elegant event hall with modern lighting"
    },
    {
      id: 2,
      src: "http://localhost:5000/uploads/halls/halls2.jpeg",
      category: "halls",
      title: "Conference Hall",
      alt: "Professional conference space"
    },
    {
      id: 3,
      src: "http://localhost:5000/uploads/resturante/res1.jpeg",
      category: "restaurant",
      title: "Fine Dining",
      alt: "Elegant restaurant interior"
    },
    {
      id: 4,
      src: "http://localhost:5000/uploads/rooms/Garden View Room - Double1.jpeg",
      category: "garden-view",
      title: "Garden View Room",
      alt: "Luxurious room with garden view"
    },
    {
      id: 5,
      src: "http://localhost:5000/uploads/rooms/Pool View Room - Double1.jpeg",
      category: "pool-view",
      title: "Pool View Room",
      alt: "Comfortable room overlooking the pool"
    },
    {
      id: 6,
      src: "http://localhost:5000/uploads/rooms/Room with Balcony - Double1.jpeg",
      category: "balcony",
      title: "Balcony Suite",
      alt: "Spacious room with private balcony"
    },
    {
      id: 7,
      src: "http://localhost:5000/uploads/rooms/Triple Room1.jpeg",
      category: "rooms",
      title: "Triple Room",
      alt: "Spacious triple accommodation"
    },
    {
      id: 8,
      src: "http://localhost:5000/uploads/rooms/Room with Balcony - Double4.jpeg",
      category: "balcony",
      title: "Deluxe Balcony",
      alt: "Premium balcony room"
    },
    {
      id: 9,
      src: "http://localhost:5000/uploads/rooms/Pool View Room - Double3.jpeg",
      category: "pool-view",
      title: "Pool View Suite",
      alt: "Luxurious suite with pool access"
    }
  ];

  // Filter categories
  const filterCategories = [
    { id: "all", label: "All", icon: "🏨" },
    { id: "halls", label: "Halls", icon: "🎉" },
    { id: "rooms", label: "Rooms", icon: "🛏️" },
    { id: "garden-view", label: "Garden View", icon: "🌿" },
    { id: "pool-view", label: "Pool View", icon: "🏊" },
    { id: "balcony", label: "Balcony", icon: "🌅" },
    { id: "restaurant", label: "Restaurant", icon: "🍽️" }
  ];

  // Filter images based on selected category
  useEffect(() => {
    if (selectedFilter === "all") {
      setFilteredImages(galleryImages);
    } else {
      setFilteredImages(galleryImages.filter(img => img.category === selectedFilter));
    }
  }, [selectedFilter]);

  // Open lightbox
  const openLightbox = (image) => {
    setLightboxImage(image);
  };

  // Close lightbox
  const closeLightbox = () => {
    setLightboxImage(null);
  };

  // Navigate to next/previous image in lightbox
  const navigateLightbox = (direction) => {
    const currentIndex = filteredImages.findIndex(img => img.id === lightboxImage.id);
    let newIndex;
    
    if (direction === "next") {
      newIndex = currentIndex < filteredImages.length - 1 ? currentIndex + 1 : 0;
    } else {
      newIndex = currentIndex > 0 ? currentIndex - 1 : filteredImages.length - 1;
    }
    
    setLightboxImage(filteredImages[newIndex]);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxImage) return;
      
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") navigateLightbox("next");
      if (e.key === "ArrowLeft") navigateLightbox("prev");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxImage]);

  return (
    <div className={styles.galleryContainer}>
      {/* Gallery Header */}
      <div className={styles.galleryHeader}>
        <h2 className={styles.galleryTitle}>Our Gallery</h2>
        <p className={styles.gallerySubtitle}>
          Explore our luxurious spaces and elegant accommodations
        </p>
      </div>

      {/* Filter Buttons */}
      <div className={styles.filterContainer}>
        <div className={styles.filterButtons}>
          {filterCategories.map((category) => (
            <button
              key={category.id}
              className={`${styles.filterBtn} ${
                selectedFilter === category.id ? styles.active : ""
              }`}
              onClick={() => setSelectedFilter(category.id)}
            >
              <span className={styles.filterIcon}>{category.icon}</span>
              <span className={styles.filterLabel}>{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className={styles.galleryGrid}>
        {filteredImages.map((image) => (
          <div
            key={image.id}
            className={styles.galleryItem}
            onClick={() => openLightbox(image)}
          >
            <div className={styles.imageContainer}>
              <img
                src={image.src}
                alt={image.alt}
                className={styles.galleryImage}
                loading="lazy"
              />
              <div className={styles.imageOverlay}>
                <div className={styles.overlayContent}>
                  <h3 className={styles.imageTitle}>{image.title}</h3>
                  <p className={styles.imageCategory}>
                    {filterCategories.find(c => c.id === image.category)?.label}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div className={styles.lightbox} onClick={closeLightbox}>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={closeLightbox}>
              ✕
            </button>
            
            <button
              className={`${styles.navBtn} ${styles.prevBtn}`}
              onClick={() => navigateLightbox("prev")}
              disabled={filteredImages.length <= 1}
            >
              ‹
            </button>
            
            <img
              src={lightboxImage.src}
              alt={lightboxImage.alt}
              className={styles.lightboxImage}
            />
            
            <button
              className={`${styles.navBtn} ${styles.nextBtn}`}
              onClick={() => navigateLightbox("next")}
              disabled={filteredImages.length <= 1}
            >
              ›
            </button>
            
            <div className={styles.lightboxInfo}>
              <h3>{lightboxImage.title}</h3>
              <p>
                {filteredImages.findIndex(img => img.id === lightboxImage.id) + 1} / {filteredImages.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelGallery;

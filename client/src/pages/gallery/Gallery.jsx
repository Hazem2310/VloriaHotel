import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import styles from "./Gallery.module.css";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const { t } = useLanguage();

  const images = [
    {
      id: 1,
      category: "rooms",
      url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
      title: "Deluxe Suite",
    },
    {
      id: 2,
      category: "rooms",
      url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
      title: "Family Room",
    },
    {
      id: 3,
      category: "restaurant",
      url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
      title: "Fine Dining",
    },
    {
      id: 4,
      category: "lobby",
      url: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800",
      title: "Grand Lobby",
    },
    {
      id: 5,
      category: "halls",
      url: "https://images.unsplash.com/photo-1519167758481-83f29da8c2b0?w=800",
      title: "Event Hall",
    },
    {
      id: 6,
      category: "outdoor",
      url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
      title: "Pool Area",
    },
    {
      id: 7,
      category: "rooms",
      url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
      title: "Executive Suite",
    },
    {
      id: 8,
      category: "restaurant",
      url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
      title: "Restaurant Interior",
    },
    {
      id: 9,
      category: "outdoor",
      url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      title: "Garden View",
    },
  ];

  const categories = [
    { id: "all", label: "All" },
    { id: "rooms", label: "Rooms" },
    { id: "restaurant", label: "Restaurant" },
    { id: "halls", label: "Event Halls" },
    { id: "lobby", label: "Lobby" },
    { id: "outdoor", label: "Outdoor" },
  ];

  const filteredImages =
    activeCategory === "all" ? images : images.filter((img) => img.category === activeCategory);

  return (
    <div className={styles.galleryPage}>
      <div className={styles.hero}>
        <h1>Gallery</h1>
        <p>Explore the luxury and elegance of Veloria Hotel</p>
      </div>

      <div className={styles.container}>
        {/* Category Filters */}
        <div className={styles.categories}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`${styles.categoryBtn} ${activeCategory === cat.id ? styles.active : ""}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <div className={styles.imageGrid}>
          {filteredImages.map((image) => (
            <div
              key={image.id}
              className={styles.imageCard}
              onClick={() => setSelectedImage(image)}
            >
              <img src={image.url} alt={image.title} />
              <div className={styles.overlay}>
                <h3>{image.title}</h3>
                <p>Click to view</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className={styles.lightbox} onClick={() => setSelectedImage(null)}>
          <button className={styles.closeBtn} onClick={() => setSelectedImage(null)}>
            ×
          </button>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage.url} alt={selectedImage.title} />
            <h2>{selectedImage.title}</h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;

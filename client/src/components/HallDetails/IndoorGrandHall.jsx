import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { hallsAPI } from "../../Api/hallsApi";
import { getAllMealPackages } from "../../Api/mealPackagesApi";
import { useAuth } from "../../context/AuthContext";
import styles from "./IndoorGrandHall.module.css";

const IndoorGrandHall = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const HALL_ID = 3;
  
  const [hall, setHall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [bookingData, setBookingData] = useState({
    eventDate: "",
    guestCount: "",
    eventType: "",
    specialRequests: "",
  });
  const [selectedServices, setSelectedServices] = useState({
    stage: false,
    soundSystem: false,
    projector: false,
    catering: false,
    decoration: false,
    parking: false,
  });
  const [mealPackages, setMealPackages] = useState([]);
  const [selectedMealPackage, setSelectedMealPackage] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    fetchHallDetails();
    fetchMealPackages();
  }, []);

  const fetchHallDetails = async () => {
    try {
      const data = await hallsAPI.getById(HALL_ID);
      if (data.success && data.hall) {
        setHall(data.hall);
      }
    } catch (error) {
      console.error("Error fetching hall details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMealPackages = async () => {
    try {
      const data = await getAllMealPackages();
      setMealPackages(data || []);
    } catch (error) {
      console.error("Error fetching meal packages:", error);
    }
  };

  const calculateTotalPrice = useCallback(() => {
    if (!hall) return;
    let total = parseFloat(hall.price) || 0;
    const serviceCosts = { stage: 200, soundSystem: 300, projector: 150, catering: 50, decoration: 500, parking: 100 };
    Object.keys(selectedServices).forEach(service => {
      if (selectedServices[service]) {
        if (service === 'catering' && bookingData.guestCount) {
          total += serviceCosts[service] * parseInt(bookingData.guestCount);
        } else {
          total += serviceCosts[service];
        }
      }
    });
    if (selectedMealPackage && bookingData.guestCount) {
      const mealPackage = mealPackages.find(pkg => pkg.package_id === selectedMealPackage);
      if (mealPackage) {
        total += parseFloat(mealPackage.price_per_person) * parseInt(bookingData.guestCount);
      }
    }
    setTotalPrice(total);
  }, [hall, selectedServices, selectedMealPackage, bookingData.guestCount, mealPackages]);

  useEffect(() => {
    calculateTotalPrice();
  }, [calculateTotalPrice]);

  const handleServiceToggle = (service) => {
    setSelectedServices(prev => ({ ...prev, [service]: !prev[service] }));
  };

  const handleBookingChange = (field, value) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const handleBooking = async () => {
    if (!user) {
      navigate('/auth', { state: { from: '/halls/indoor-grand-hall' } });
      return;
    }
    if (!bookingData.eventDate || !bookingData.guestCount) {
      alert('Please fill in all required fields');
      return;
    }
    console.log('Booking data:', { hall_id: HALL_ID, ...bookingData, services: selectedServices, mealPackage: selectedMealPackage, totalPrice });
    alert('Booking functionality will be implemented');
  };

  const getImageGallery = () => {
    if (hall && hall.image_gallery) {
      try {
        const gallery = JSON.parse(hall.image_gallery);
        return gallery.map(img => `http://localhost:5000${img}`);
      } catch (e) {
        return hall.image_url ? [`http://localhost:5000${hall.image_url}`] : [];
      }
    }
    return hall?.image_url ? [`http://localhost:5000${hall.image_url}`] : ['http://localhost:5000/uploads/halls/default-hall.jpg'];
  };

  const getHallFeatures = () => {
    if (!hall) return [];
    const features = [];
    if (hall.has_stage) features.push({ icon: "🎭", name: "Stage Available" });
    if (hall.sound_system) features.push({ icon: "🎤", name: "Sound System" });
    if (hall.projector) features.push({ icon: "📽️", name: "Projector & Screen" });
    if (hall.catering_available) features.push({ icon: "🍽️", name: "Catering Services" });
    if (hall.decoration_included) features.push({ icon: "🎨", name: "Decoration Options" });
    if (hall.parking_available) features.push({ icon: "🅿️", name: "Parking Available" });
    return features;
  };

  if (loading) {
    return <div className={styles.loading}>Loading Indoor Grand Hall...</div>;
  }

  if (!hall) {
    return (
      <div className={styles.error}>
        <h2>Hall not found</h2>
        <button onClick={() => navigate("/halls")} className={styles.backBtn}>Back to Halls</button>
      </div>
    );
  }

  const images = getImageGallery();
  const features = getHallFeatures();

  return (
    <div className={styles.hallDetailsPage}>
      <div className={styles.backSection}>
        <button onClick={() => navigate("/halls")} className={styles.backBtn}>← Back to Halls</button>
      </div>

      <div className={styles.container}>
        <div className={styles.gallerySection}>
          <div className={styles.mainImage}>
            <img src={images[selectedImage]} alt={hall.name} />
            {hall.status !== 'AVAILABLE' && (<div className={styles.bookedOverlay}><span>Currently Booked</span></div>)}
          </div>
          {images.length > 1 && (
            <div className={styles.thumbnails}>
              {images.map((img, index) => (
                <div key={index} className={`${styles.thumbnail} ${selectedImage === index ? styles.activeThumbnail : ""}`} onClick={() => setSelectedImage(index)}>
                  <img src={img} alt={`View ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.infoSection}>
          <div className={styles.header}>
            <div>
              <h1>{hall.name}</h1>
              <div className={styles.hallMeta}>
                <span className={styles.metaItem}><span className={styles.icon}>🏛️</span>Indoor Hall</span>
                <span className={styles.metaItem}><span className={styles.icon}>👥</span>Up to {hall.capacity} Guests</span>
              </div>
            </div>
            <div className={styles.priceBox}>
              <span className={styles.price}>${hall.price}</span>
              <span className={styles.period}>/ event</span>
            </div>
          </div>

          <div className={styles.availability}>
            {hall.status === 'AVAILABLE' ? (<span className={styles.available}>✓ Available for Booking</span>) : (<span className={styles.unavailable}>✗ Currently Booked</span>)}
          </div>

          <div className={styles.description}>
            <h2>About This Hall</h2>
            <p>The Indoor Grand Hall is designed to deliver a luxurious and unforgettable experience. It features elegant chandeliers, polished marble floors, and sophisticated ambient lighting that creates a warm and refined atmosphere. The hall is fully air-conditioned and equipped with advanced audio-visual systems, making it ideal for weddings, large celebrations, and corporate events.</p>
            <p>Guests can enjoy flexible seating arrangements and customizable décor options to match any theme. The booking process allows users to select the number of guests, catering services, and additional features, with dynamic pricing tailored to their preferences. This hall combines elegance, comfort, and functionality for premium events.</p>
          </div>

          <div className={styles.features}>
            <h2>Hall Features</h2>
            <div className={styles.featuresGrid}>
              {features.map((feature, index) => (
                <div key={index} className={styles.featureItem}>
                  <span className={styles.featureIcon}>{feature.icon}</span>
                  <span className={styles.featureName}>{feature.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.bookingSection}>
            <h2>Book This Hall</h2>
            
            <div className={styles.formGroup}>
              <label>Event Date *</label>
              <input type="date" value={bookingData.eventDate} onChange={(e) => handleBookingChange('eventDate', e.target.value)} min={new Date().toISOString().split('T')[0]} />
            </div>

            <div className={styles.formGroup}>
              <label>Number of Guests *</label>
              <input type="number" placeholder="Enter guest count" value={bookingData.guestCount} onChange={(e) => handleBookingChange('guestCount', e.target.value)} max={hall.capacity} min="1" />
            </div>

            <div className={styles.formGroup}>
              <label>Event Type</label>
              <select value={bookingData.eventType} onChange={(e) => handleBookingChange('eventType', e.target.value)}>
                <option value="">Select event type</option>
                <option value="wedding">Wedding</option>
                <option value="corporate">Corporate Event</option>
                <option value="birthday">Birthday Party</option>
                <option value="conference">Conference</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className={styles.servicesSection}>
              <h3>Additional Services</h3>
              <div className={styles.servicesGrid}>
                {hall.has_stage && (<label className={styles.serviceCheckbox}><input type="checkbox" checked={selectedServices.stage} onChange={() => handleServiceToggle('stage')} /><span>Stage Setup (+$200)</span></label>)}
                {hall.sound_system && (<label className={styles.serviceCheckbox}><input type="checkbox" checked={selectedServices.soundSystem} onChange={() => handleServiceToggle('soundSystem')} /><span>Sound System (+$300)</span></label>)}
                {hall.projector && (<label className={styles.serviceCheckbox}><input type="checkbox" checked={selectedServices.projector} onChange={() => handleServiceToggle('projector')} /><span>Projector & Screen (+$150)</span></label>)}
                {hall.catering_available && (<label className={styles.serviceCheckbox}><input type="checkbox" checked={selectedServices.catering} onChange={() => handleServiceToggle('catering')} /><span>Catering (+$50/guest)</span></label>)}
                {hall.decoration_included && (<label className={styles.serviceCheckbox}><input type="checkbox" checked={selectedServices.decoration} onChange={() => handleServiceToggle('decoration')} /><span>Premium Decoration (+$500)</span></label>)}
                {hall.parking_available && (<label className={styles.serviceCheckbox}><input type="checkbox" checked={selectedServices.parking} onChange={() => handleServiceToggle('parking')} /><span>Valet Parking (+$100)</span></label>)}
              </div>
            </div>

            {mealPackages.length > 0 && (
              <div className={styles.mealSection}>
                <h3>Meal Packages</h3>
                <div className={styles.mealPackages}>
                  {mealPackages.map(pkg => (
                    <div key={pkg.package_id} className={`${styles.mealCard} ${selectedMealPackage === pkg.package_id ? styles.selectedMeal : ''}`} onClick={() => setSelectedMealPackage(pkg.package_id === selectedMealPackage ? null : pkg.package_id)}>
                      <h4>{pkg.package_name}</h4>
                      <p className={styles.mealDescription}>{pkg.description}</p>
                      <p className={styles.mealPrice}>${pkg.price_per_person}/person</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.formGroup}>
              <label>Special Requests</label>
              <textarea placeholder="Any special requirements or requests..." value={bookingData.specialRequests} onChange={(e) => handleBookingChange('specialRequests', e.target.value)} rows="4" />
            </div>

            <div className={styles.priceSummary}>
              <h3>Price Summary</h3>
              <div className={styles.priceBreakdown}>
                <div className={styles.priceRow}><span>Hall Rental</span><span>${hall.price}</span></div>
                {Object.keys(selectedServices).map(service => {
                  if (!selectedServices[service]) return null;
                  const costs = { stage: 200, soundSystem: 300, projector: 150, catering: bookingData.guestCount ? 50 * parseInt(bookingData.guestCount) : 0, decoration: 500, parking: 100 };
                  return (<div key={service} className={styles.priceRow}><span>{service.charAt(0).toUpperCase() + service.slice(1)}</span><span>${costs[service]}</span></div>);
                })}
                {selectedMealPackage && bookingData.guestCount && (
                  <div className={styles.priceRow}><span>Meal Package ({bookingData.guestCount} guests)</span><span>${(mealPackages.find(p => p.package_id === selectedMealPackage)?.price_per_person || 0) * parseInt(bookingData.guestCount)}</span></div>
                )}
                <div className={styles.totalRow}><span>Total Estimated Cost</span><span>${totalPrice.toFixed(2)}</span></div>
              </div>
            </div>

            <button className={styles.bookBtn} onClick={handleBooking} disabled={hall.status !== 'AVAILABLE'}>
              {user ? 'Confirm Booking' : 'Sign In to Book'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndoorGrandHall;

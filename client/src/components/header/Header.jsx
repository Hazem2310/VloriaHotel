import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";
import style from "./header.module.css";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [bookingDropdown, setBookingDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout, isAdmin } = useAuth();
  const { t } = useLanguage();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setBookingDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className={style.header}>
      <div className={style.container}>
        {/* Logo */}
        <Link to="/" className={style.brand} aria-label="Veloria Hotel Home">
          <span className={style.brandMark}>V</span>
          <span className={style.brandText}>
            <span className={style.brandName}>Veloria</span>
            <span className={style.brandSub}>Hotel</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className={style.nav} aria-label="Main navigation">
          <Link className={style.link} to="/">
            {t("home")}
          </Link>
          
          {/* Booking Dropdown */}
          <div className={style.dropdown} ref={dropdownRef}>
            <button
              className={style.dropdownToggle}
              onClick={() => setBookingDropdown(!bookingDropdown)}
              aria-expanded={bookingDropdown}
            >
              Booking <span className={style.arrow}>▼</span>
            </button>
            {bookingDropdown && (
              <div className={style.dropdownMenu}>
                <Link
                  to="/rooms"
                  className={style.dropdownItem}
                  onClick={() => setBookingDropdown(false)}
                >
                  <span className={style.dropdownIcon}>🛏️</span>
                  Rooms Booking
                </Link>
                <Link
                  to="/halls"
                  className={style.dropdownItem}
                  onClick={() => setBookingDropdown(false)}
                >
                  <span className={style.dropdownIcon}>🏛️</span>
                  Halls Booking
                </Link>
                <Link
                  to="/restaurant"
                  className={style.dropdownItem}
                  onClick={() => setBookingDropdown(false)}
                >
                  <span className={style.dropdownIcon}>🍽️</span>
                  Restaurant Reservation
                </Link>
              </div>
            )}
          </div>

          <Link className={style.link} to="/gallery">
            Gallery
          </Link>
          <Link className={style.link} to="/contact">
            {t("contact")}
          </Link>
          {user && (
            <Link className={style.link} to="/my-bookings">
              {t("myBookings")}
            </Link>
          )}
          {isAdmin && (
            <Link className={style.link} to="/admin">
              {t("dashboard")}
            </Link>
          )}
        </nav>

        {/* Actions */}
        <div className={style.actions}>
          <LanguageSwitcher />
          {user ? (
            <>
              <span className={style.userName}>{user.name}</span>
              <button className={style.secondaryBtn} onClick={logout}>
                {t("logout")}
              </button>
            </>
          ) : (
            <Link className={style.primaryBtn} to="/auth">
              {t("login")}
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            className={style.menuBtn}
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label="Toggle menu"
            type="button"
          >
            <span className={style.menuLine} />
            <span className={style.menuLine} />
            <span className={style.menuLine} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`${style.mobilePanel} ${open ? style.open : ""}`}>
        <Link className={style.mobileLink} to="/" onClick={() => setOpen(false)}>
          {t("home")}
        </Link>
        
        <div className={style.mobileBookingSection}>
          <div className={style.mobileBookingTitle}>Booking</div>
          <Link className={style.mobileSubLink} to="/rooms" onClick={() => setOpen(false)}>
            🛏️ Rooms Booking
          </Link>
          <Link className={style.mobileSubLink} to="/halls" onClick={() => setOpen(false)}>
            🏛️ Halls Booking
          </Link>
          <Link className={style.mobileSubLink} to="/restaurant" onClick={() => setOpen(false)}>
            🍽️ Restaurant Reservation
          </Link>
        </div>

        <Link className={style.mobileLink} to="/gallery" onClick={() => setOpen(false)}>
          Gallery
        </Link>
        <Link className={style.mobileLink} to="/contact" onClick={() => setOpen(false)}>
          {t("contact")}
        </Link>
        {user && (
          <Link className={style.mobileLink} to="/my-bookings" onClick={() => setOpen(false)}>
            {t("myBookings")}
          </Link>
        )}
        {isAdmin && (
          <Link className={style.mobileLink} to="/admin" onClick={() => setOpen(false)}>
            {t("dashboard")}
          </Link>
        )}

        <div className={style.mobileActions}>
          <LanguageSwitcher />
          {user ? (
            <>
              <span className={style.userName}>{user.name}</span>
              <button className={style.secondaryBtn} onClick={() => { logout(); setOpen(false); }}>
                {t("logout")}
              </button>
            </>
          ) : (
            <Link className={style.primaryBtn} to="/auth" onClick={() => setOpen(false)}>
              {t("login")}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";
import style from "./header.module.css";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [bookingDropdown, setBookingDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const { user, logout } = useAuth();
  const { t } = useLanguage();

  // Normalize roles from backend
  const userRoles = useMemo(() => {
    if (!user) return [];

    if (Array.isArray(user.roles)) {
      return user.roles.map((r) =>
        typeof r === "string" ? r.toLowerCase() : String(r?.role_name || "").toLowerCase()
      );
    }

    if (user.role) {
      return [String(user.role).toLowerCase()];
    }

    if (user.role_name) {
      return [String(user.role_name).toLowerCase()];
    }

    return [];
  }, [user]);

  const isCustomer = userRoles.includes("customer");
  const isEmployee = userRoles.includes("employee");
  const isDeptManager = userRoles.includes("dept_manager");
  const isAdmin = userRoles.includes("admin");
  const isOwner = userRoles.includes("owner");

  const isStaff = isEmployee || isDeptManager || isAdmin || isOwner;
  const isGuest = !user;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setBookingDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeAll = () => {
    setOpen(false);
    setBookingDropdown(false);
  };

  const displayName =
    user?.name ||
    `${user?.first_name || ""} ${user?.last_name || ""}`.trim() ||
    user?.email ||
    "User";

  return (
    <header className={style.header}>
      <div className={style.container}>
        <Link to={isStaff ? "/admin" : "/"} className={style.brand} aria-label="Veloria Hotel Home">
          <span className={style.brandMark}>V</span>
          <span className={style.brandText}>
            <span className={style.brandName}>Veloria</span>
            <span className={style.brandSub}>Hotel</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className={style.nav} aria-label="Main navigation">
          {(isGuest || isCustomer) && (
            <>
              <Link className={style.link} to="/">
                {t("home")}
              </Link>

              <div className={style.dropdown} ref={dropdownRef}>
                <button
                  className={style.dropdownToggle}
                  onClick={() => setBookingDropdown(!bookingDropdown)}
                  aria-expanded={bookingDropdown}
                  type="button"
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
            </>
          )}

          {isCustomer && (
            <Link className={style.link} to="/my-bookings">
              {t("myBookings")}
            </Link>
          )}

          {isStaff && (
            <>
              <Link className={style.link} to="/admin">
                Dashboard
              </Link>

              <Link className={style.link} to="/admin/rooms">
                Manage Rooms
              </Link>

              <Link className={style.link} to="/admin/manage-bookings">
                Manage Bookings
              </Link>

              {(isDeptManager || isAdmin || isOwner) && (
                <Link className={style.link} to="/admin/manage-employees">
                  Manage Employees
                </Link>
              )}

              {isOwner && (
                <Link className={style.link} to="/admin/owner">
                  Owner Panel
                </Link>
              )}
            </>
          )}
        </nav>

        {/* Actions */}
        <div className={style.actions}>
          <LanguageSwitcher />

          {user ? (
            <>
              <span className={style.userName}>{displayName}</span>
              <button className={style.secondaryBtn} onClick={logout} type="button">
                {t("logout")}
              </button>
            </>
          ) : (
            <Link className={style.primaryBtn} to="/auth">
              {t("login")}
            </Link>
          )}

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
        {(isGuest || isCustomer) && (
          <>
            <Link className={style.mobileLink} to="/" onClick={closeAll}>
              {t("home")}
            </Link>

            <div className={style.mobileBookingSection}>
              <div className={style.mobileBookingTitle}>Booking</div>

              <Link className={style.mobileSubLink} to="/rooms" onClick={closeAll}>
                🛏️ Rooms Booking
              </Link>

              <Link className={style.mobileSubLink} to="/halls" onClick={closeAll}>
                🏛️ Halls Booking
              </Link>

              <Link className={style.mobileSubLink} to="/restaurant" onClick={closeAll}>
                🍽️ Restaurant Reservation
              </Link>
            </div>

            <Link className={style.mobileLink} to="/gallery" onClick={closeAll}>
              Gallery
            </Link>

            <Link className={style.mobileLink} to="/contact" onClick={closeAll}>
              {t("contact")}
            </Link>
          </>
        )}

        {isCustomer && (
          <Link className={style.mobileLink} to="/my-bookings" onClick={closeAll}>
            {t("myBookings")}
          </Link>
        )}

        {isStaff && (
          <>
            <Link className={style.mobileLink} to="/admin" onClick={closeAll}>
              Dashboard
            </Link>

            <Link className={style.mobileLink} to="/admin/manage-rooms" onClick={closeAll}>
              Manage Rooms
            </Link>

            <Link className={style.mobileLink} to="/admin/manage-bookings" onClick={closeAll}>
              Manage Bookings
            </Link>

            {(isDeptManager || isAdmin || isOwner) && (
              <Link className={style.mobileLink} to="/admin/manage-employees" onClick={closeAll}>
                Manage Employees
              </Link>
            )}

            {isOwner && (
              <Link className={style.mobileLink} to="/admin/owner" onClick={closeAll}>
                Owner Panel
              </Link>
            )}
          </>
        )}

        <div className={style.mobileActions}>
          <LanguageSwitcher />

          {user ? (
            <>
              <span className={style.userName}>{displayName}</span>
              <button
                className={style.secondaryBtn}
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                type="button"
              >
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
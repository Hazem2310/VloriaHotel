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

  const userRoles = useMemo(() => {
    if (!user) return [];

    if (Array.isArray(user.roles)) {
      return user.roles.map((r) =>
        typeof r === "string"
          ? r.toLowerCase()
          : String(r?.role_name || "").toLowerCase()
      );
    }

    if (user.role) {
      return [String(user.role).toLowerCase()];
    }

    return [];
  }, [user]);

  const isCustomer = userRoles.includes("customer");
  const isEmployee = userRoles.includes("employee");
  const isOwner = userRoles.includes("owner");
  const isAdmin = userRoles.includes("admin");

  const isManagement = isOwner || isAdmin;

  const isGuest = !user;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setBookingDropdown(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const closeAll = () => {
    setOpen(false);
    setBookingDropdown(false);
  };

  const displayName =
    `${user?.first_name || ""} ${
      user?.last_name || ""
    }`.trim() ||
    user?.email ||
    "User";

  return (
    <header className={style.header}>
      <div className={style.container}>
        <Link
          to={
            isManagement
              ? "/admin"
              : isEmployee
              ? "/employee"
              : "/"
          }
          className={style.brand}
        >
          <span className={style.brandMark}>V</span>

          <span className={style.brandText}>
            <span className={style.brandName}>
              Veloria
            </span>

            <span className={style.brandSub}>
              Hotel
            </span>
          </span>
        </Link>

        {/* Desktop Nav */}

        <nav className={style.nav}>
          {(isGuest || isCustomer) && (
            <>
              <Link
                className={style.link}
                to="/"
              >
                {t("home")}
              </Link>

              <div
                className={style.dropdown}
                ref={dropdownRef}
              >
                <button
                  className={style.dropdownToggle}
                  onClick={() =>
                    setBookingDropdown(
                      !bookingDropdown
                    )
                  }
                  type="button"
                >
                  Booking
                </button>

                {bookingDropdown && (
                  <div className={style.dropdownMenu}>
                    <Link
                      to="/rooms"
                      className={
                        style.dropdownItem
                      }
                    >
                      🛏️ Rooms
                    </Link>

                    <Link
                      to="/halls"
                      className={
                        style.dropdownItem
                      }
                    >
                      🏛️ Halls
                    </Link>

                    <Link
                      to="/restaurant"
                      className={
                        style.dropdownItem
                      }
                    >
                      🍽️ Restaurant
                    </Link>
                  </div>
                )}
              </div>

              <Link
                className={style.link}
                to="/gallery"
              >
                Gallery
              </Link>

              <Link
                className={style.link}
                to="/contact"
              >
                Contact
              </Link>
            </>
          )}

          {isCustomer && (
            <Link
              className={style.link}
              to="/my-bookings"
            >
              My Bookings
            </Link>
          )}

          {/* OWNER / ADMIN */}

          {isManagement && (
            <>
              <Link
                className={style.link}
                to="/admin"
              >
                Dashboard
              </Link>

              <Link
                className={style.link}
                to="/admin/manage-rooms"
              >
                Manage Rooms
              </Link>

              <Link
                className={style.link}
                to="/admin/manage-bookings"
              >
                Manage Bookings
              </Link>
            </>
          )}

          {/* EMPLOYEE */}

          {isEmployee && (
            <>
              <Link
                className={style.link}
                to="/employee"
              >
                Employee Dashboard
              </Link>

              <Link
                className={style.link}
                to="/rooms"
              >
                Rooms
              </Link>

              <Link
                className={style.link}
                to="/booking"
              >
                Bookings
              </Link>
            </>
          )}
        </nav>

        {/* Actions */}

        <div className={style.actions}>
          <LanguageSwitcher />

          {user ? (
            <>
              <span className={style.userName}>
                {displayName}
              </span>

              <button
                className={style.secondaryBtn}
                onClick={logout}
                type="button"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              className={style.primaryBtn}
              to="/auth"
            >
              Login
            </Link>
          )}

          <button
            className={style.menuBtn}
            onClick={() => setOpen(!open)}
            type="button"
          >
            <span className={style.menuLine} />
            <span className={style.menuLine} />
            <span className={style.menuLine} />
          </button>
        </div>
      </div>
    </header>
  );
}
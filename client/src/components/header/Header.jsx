import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";
import style from "./header.module.css";
import logo from "../../assets/img/logo.png";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [bookingDropdown, setBookingDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const { user, logout } = useAuth();
  const { t } = useLanguage();

  // 🔹 role from backend
  const role = (user?.role || "").toLowerCase();

  // 🔹 role conditions
  const isCustomer = role === "customer";
  const isEmployee = role === "employee";
  const isManager = role === "manager";
  const isAdmin = role === "admin";
  const isOwner = role === "owner";

  const isStaff = isManager || isAdmin || isOwner;
  const isEmployeeOnly = isEmployee && !isStaff;
  const isGuest = !user;

  const closeAll = () => {
    setOpen(false);
    setBookingDropdown(false);
  };

  const displayName = user?.first_name || user?.name || user?.email || "User";

  return (
    <header className={style.header}>
      {/* LOGO */}
      <Link to="/" className={style.logoLink}>
        <img src={logo} alt="Veloria Hotel" className={style.logo} />
      </Link>

      <div className={style.container}>
        {/* BRAND */}
        <Link
          to={isStaff ? "/admin" : isEmployeeOnly ? "/employee" : "/"}
          className={style.brand}
        >
          <span className={style.brandMark}>V</span>
          <span className={style.brandText}>
            <span className={style.brandName}>Veloria</span>
            <span className={style.brandSub}>Hotel</span>
          </span>
        </Link>

        {/* NAV */}
        <nav className={style.nav}>
          {/* 🟢 GUEST + CUSTOMER */}
          {(isGuest || isCustomer) && (
            <>
              <Link to="/" className={style.link}>
                Home
              </Link>

              <div className={style.dropdown} ref={dropdownRef}>
                <button
                  className={style.dropdownToggle}
                  onClick={() => setBookingDropdown(!bookingDropdown)}
                >
                  Booking ▼
                </button>

                {bookingDropdown && (
                  <div className={style.dropdownMenu}>
                    <Link to="/rooms" onClick={closeAll}>
                      Rooms
                    </Link>
                    <Link to="/halls" onClick={closeAll}>
                      Halls
                    </Link>
                    <Link to="/restaurant" onClick={closeAll}>
                      Restaurant
                    </Link>
                  </div>
                )}
              </div>

              <Link to="/gallery" className={style.link}>
                Gallery
              </Link>
              <Link to="/contact" className={style.link}>
                Contact
              </Link>
            </>
          )}

          {/* 👷 EMPLOYEE ONLY */}
          {isEmployeeOnly && (
            <>
              <Link to="/employee" className={style.link}>
                Dashboard
              </Link>
              <Link to="/employee/tasks" className={style.link}>
                My Tasks
              </Link>
              <Link to="/employee/schedule" className={style.link}>
                Schedule
              </Link>
              <Link to="/employee/salary" className={style.link}>
                Salary
              </Link>
              <Link to="/employee/messages" className={style.link}>
                Messages
              </Link>
            </>
          )}

          {/* 👨‍💼 DEPT MANAGER */}
          {isManager && (
            <>
              <Link to="/manager" className={style.link}>
                Dashboard
              </Link>
              <Link to="/manager/employees" className={style.link}>
                Employees
              </Link>
              <Link to="/manager/tasks" className={style.link}>
                Tasks
              </Link>
              <Link to="/manager/schedule" className={style.link}>
                Schedule
              </Link>
              <Link to="/manager/messages" className={style.link}>
                Messages
              </Link>
              <Link to="/manager/requests" className={style.link}>
                Requests
              </Link>
              <Link to="/manager/salaries" className={style.link}>
                Salaries
              </Link>
            </>
          )}

          {/* 🔴 ADMIN / OWNER */}
          {(isAdmin || isOwner) && (
            <>
              <Link to="/admin" className={style.link}>
                Admin Dashboard
              </Link>
              <Link to="/admin/rooms" className={style.link}>
                Rooms
              </Link>
              <Link to="/admin/bookings" className={style.link}>
                Bookings
              </Link>
              <Link to="/admin/employees" className={style.link}>
                Employees
              </Link>
            </>
          )}
        </nav>

        {/* ACTIONS */}
        <div className={style.actions}>
          <LanguageSwitcher />

          {user ? (
            <>
              <span className={style.userName}>{displayName}</span>
              <button onClick={logout} className={style.secondaryBtn}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/auth" className={style.primaryBtn}>
              Login
            </Link>
          )}

          <button className={style.menuBtn} onClick={() => setOpen(!open)}>
            ☰
          </button>
        </div>
      </div>

      {/* MOBILE */}
      <div className={`${style.mobilePanel} ${open ? style.open : ""}`}>
        {(isGuest || isCustomer) && (
          <>
            <Link to="/" onClick={closeAll}>
              Home
            </Link>
            <Link to="/rooms" onClick={closeAll}>
              Rooms
            </Link>
            <Link to="/halls" onClick={closeAll}>
              Halls
            </Link>
            <Link to="/restaurant" onClick={closeAll}>
              Restaurant
            </Link>
          </>
        )}

        {isEmployeeOnly && (
          <>
            <Link to="/employee" onClick={closeAll}>
              Dashboard
            </Link>
            <Link to="/employee/tasks" onClick={closeAll}>
              Tasks
            </Link>
            <Link to="/employee/schedule" onClick={closeAll}>
              Schedule
            </Link>
            <Link to="/employee/salary" onClick={closeAll}>
              Salary
            </Link>
            <Link to="/employee/messages" onClick={closeAll}>
              Messages
            </Link>
          </>
        )}

        {isManager && (
          <>
            <Link to="/manager" onClick={closeAll}>
              Dashboard
            </Link>
            <Link to="/manager/employees" onClick={closeAll}>
              Employees
            </Link>
            <Link to="/manager/tasks" onClick={closeAll}>
              Tasks
            </Link>
            <Link to="/manager/requests" onClick={closeAll}>
              Requests
            </Link>
          </>
        )}

        {(isAdmin || isOwner) && (
          <>
            <Link to="/admin" onClick={closeAll}>
              Admin
            </Link>
          </>
        )}

        <div className={style.mobileActions}>
          {user ? (
            <button onClick={logout}>Logout</button>
          ) : (
            <Link to="/auth">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
}

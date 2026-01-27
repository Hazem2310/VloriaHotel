import React, { useState } from "react";
import style from "./header.module.css";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className={style.header}>
      <div className={style.container}>
        {/* Logo */}
        <a href="/" className={style.brand} aria-label="Vloria Hotel Home">
          <span className={style.brandMark}>V</span>
          <span className={style.brandText}>
            <span className={style.brandName}>Vloria</span>
            <span className={style.brandSub}>Hotel</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className={style.nav} aria-label="Main navigation">
          <a className={style.link} href="#rooms">
            Rooms
          </a>
          <a className={style.link} href="#offers">
            Offers
          </a>
          <a className={style.link} href="#gallery">
            Gallery
          </a>
          <a className={style.link} href="#contact">
            Contact
          </a>
        </nav>

        {/* Actions */}
        <div className={style.actions}>
          <a className={style.secondaryBtn} href="#login">
            Sign in
          </a>
          <a className={style.primaryBtn} href="#book">
            Book Now
          </a>

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
        <a
          className={style.mobileLink}
          href="#rooms"
          onClick={() => setOpen(false)}
        >
          Rooms
        </a>
        <a
          className={style.mobileLink}
          href="#offers"
          onClick={() => setOpen(false)}
        >
          Offers
        </a>
        <a
          className={style.mobileLink}
          href="#gallery"
          onClick={() => setOpen(false)}
        >
          Gallery
        </a>
        <a
          className={style.mobileLink}
          href="#contact"
          onClick={() => setOpen(false)}
        >
          Contact
        </a>

        <div className={style.mobileActions}>
          <a
            className={style.secondaryBtn}
            href="#login"
            onClick={() => setOpen(false)}
          >
            Sign in
          </a>
          <a
            className={style.primaryBtn}
            href="#book"
            onClick={() => setOpen(false)}
          >
            Book Now
          </a>
        </div>
      </div>
    </header>
  );
}

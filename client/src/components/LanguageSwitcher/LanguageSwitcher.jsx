import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import styles from "./LanguageSwitcher.module.css";

const LanguageSwitcher = () => {
  const { language, changeLanguage } = useLanguage();

  const languages = [
    { code: "en", label: "EN", name: "English" },
    { code: "ar", label: "ع", name: "العربية" },
    { code: "he", label: "ע", name: "עברית" },
  ];

  return (
    <div className={styles.languageSwitcher}>
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          className={`${styles.langButton} ${language === lang.code ? styles.active : ""}`}
          title={lang.name}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;

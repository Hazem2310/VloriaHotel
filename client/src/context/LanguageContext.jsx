import React, { createContext, useState, useContext, useEffect } from "react";
import translations from "../translations";

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
    
    // Set document direction based on language
    if (language === "ar" || language === "he") {
      document.documentElement.dir = "rtl";
      document.documentElement.lang = language;
    } else {
      document.documentElement.dir = "ltr";
      document.documentElement.lang = language;
    }
  }, [language]);

  const changeLanguage = (lang) => {
    if (["en", "ar", "he"].includes(lang)) {
      setLanguage(lang);
    }
  };

  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  const value = {
    language,
    changeLanguage,
    t,
    isRTL: language === "ar" || language === "he",
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export default LanguageContext;

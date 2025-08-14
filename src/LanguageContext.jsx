// src/LanguageContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. Create the context
const LanguageContext = createContext();

// 2. Create a custom hook for easy consumption
export const useLanguage = () => {
    return useContext(LanguageContext);
};

// 3. Create the Provider component
export const LanguageProvider = ({ children }) => {
    // State to hold the current language.
    // It tries to get the saved language from localStorage, defaulting to 'bn' (Bengali).
    const [language, setLanguage] = useState(
        () => localStorage.getItem('lang') || 'bn'
    );

    // Effect to update localStorage whenever the language changes.
    // This makes the user's selection persist across browser sessions.
    useEffect(() => {
        localStorage.setItem('lang', language);
    }, [language]);

    // The value that will be supplied to all consuming components.
    const value = {
        language,
        setLanguage,
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

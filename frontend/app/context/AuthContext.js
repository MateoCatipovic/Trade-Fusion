// src/context/AuthContext.js
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking login status, replace with actual logic
    const checkLoginStatus = () => {
      const token = localStorage.getItem("csrfToken");
      setIsLoggedIn(!!token);
      setLoading(false);
    };

    checkLoginStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

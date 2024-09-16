// src/context/AuthContext.js
"use client";
import axios from "axios";
import React, { createContext, useContext, useState, useEffect } from "react";
import { logOut } from "../../utils/logOut";
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Initialize state based on localStorage
    if (typeof window !== "undefined") {
      const storedStatus = localStorage.getItem("isLoggedIn");
      console.log("pocetna: ", storedStatus);
      return storedStatus === "true";
    }
  });
  const [loading, setLoading] = useState(true);

  const checkCookie = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/auth/check-cookie",
        { withCredentials: true }
      );

      return response.data.success;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Simulate checking login status, replace with actual logic
  const checkLoginStatus = async () => {
    const cookieStatus = await checkCookie();
    console.log("cookieStatus:", cookieStatus);
    if (!cookieStatus) {
      localStorage.setItem("isLoggedIn", "false");
      await logOut();
    }
    
    setLoading(false);
  };

  useEffect(() => {
     if (isLoggedIn) {
      checkLoginStatus(); // Check immediately when the user logs in
      // Start interval to check login status every 6 seconds
      const interval = setInterval(() => {
        checkLoginStatus();
      }, 6000);

      return () => clearInterval(interval);
    } // Cleanup the interval on unmount
  }, []);


  // Additional useEffect to log whenever isLoggedIn changes
  useEffect(() => {
    console.log("isLoggedIn:", isLoggedIn);

    // if (!isLoggedIn) {
    //   //checkLoginStatus();
    //   //doLogOut();
    // }
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

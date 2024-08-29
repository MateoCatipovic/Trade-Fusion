"use client";
import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import TwitterLogin from "../components/TwitterLogin";
import TwitterHomeTimeline from "../components/TwitterHomeTimeline";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Twitter = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const { isLoggedIn, loading } = useAuth();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedValue = localStorage.getItem("loggedIn");
      console.log("Stored value from localStorage:", storedValue);
      setLoggedIn(storedValue ? JSON.parse(storedValue) : false);
    }
  }, []);

  return (
    <div>
      <Navbar />
      {isLoggedIn ? (
        loggedIn ? (
          <TwitterHomeTimeline loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
        ) : (
          <TwitterLogin loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
        )
      ) : (
        <strong className="text-2xl">Please log in to access <a className="text-blue-500">Twitter</a> content.</strong>
      )}
    </div>
  );
};

export default Twitter;

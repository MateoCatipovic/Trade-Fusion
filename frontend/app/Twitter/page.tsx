"use client";
import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import TwitterLogin from "../components/TwitterLogin";
import TwitterHomeTimeline from "../components/TwitterHomeTimeline";
import { useState } from "react";

const Twitter = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

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
      {loggedIn ? (
        <TwitterHomeTimeline loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      ) : (
        <TwitterLogin loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      )}
    </div>
  );
};

export default Twitter;

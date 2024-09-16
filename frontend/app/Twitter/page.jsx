"use client";
import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import TwitterLogin from "./TwitterLogin";
import TwitterHomeTimeline from "./TwitterHomeTimeline";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Twitter = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const { isLoggedIn, loading } = useAuth();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedValue = localStorage.getItem("loggedIn");
      console.log("Stored value from localStorage:", storedValue);
      setLoggedIn(storedValue ? JSON.parse(storedValue) : false);
    }
  }, []);

  //  // Show a loading state until the authentication status is determined
  //  if (loading) {
  //   return (
  //     <div>
  //       <Navbar />
  //       <p>Loading...</p>
  //     </div>
  //   );
  // }

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
        <strong className="text-2xl">
          Please log in to access <a className="text-blue-500">Twitter</a>{" "}
          content.
        </strong>
      )}
    </div>
  );
};

export default Twitter;

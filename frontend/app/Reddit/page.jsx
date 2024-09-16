"use client";
import React from "react";
import Navbar from "../components/Navbar";
import SubredditPosts from "./SubredditPosts";
import { useAuth } from "../context/AuthContext";

const Reddit = () => {
  const { isLoggedIn, loading } = useAuth();
  // Show a loading state until the authentication status is determined
  if (loading) {
    return (
      <div>
        <Navbar />
        <p>Loading...</p>
      </div>
    );
  }
  return (
    <div>
      {" "}
      <Navbar />
      {isLoggedIn ? (
        <SubredditPosts />
      ) : (
        <strong className="text-2xl">
          Please log in to access <a className="text-red-500">Subreddit</a>{" "}
          posts.
        </strong>
      )}
    </div>
  );
};

export default Reddit;

"use client";
import React, { useState, useEffect } from "react";
import PostItem from "./PostItem";
import { fetchRedditPosts } from "../api/redditApi";

const SubredditPosts = () => {
  const [redditPosts, setRedditPosts] = useState([]);


  // const fetchRedditPosts = async () => {
  //   try {
  //     const response = await fetch("http://localhost:5000/fetch-reddit-posts");
  //     const data = await response.json();
  //     setRedditPosts(Array.isArray(data) ? data : []); // Ensure tweets is always an array
  //   } catch (error) {
  //     console.error("Error fetching tweets:", error);
  //   }
  // };

  useEffect(() => {
    
    const data = fetchRedditPosts();
    setRedditPosts(Array.isArray(data) ? data : []); // Ensure tweets is always an array
  }, []);

  return (
    <div>
      <div>
        {redditPosts.length === 0 ? (
          <p>No posts available.</p>
        ) : (
          <ul>
            {redditPosts.map((post, index) => (
              <li key={index}>
                <PostItem post={post} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SubredditPosts;

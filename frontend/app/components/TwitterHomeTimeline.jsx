"use client";
import React, { useState, useEffect } from "react";
import {
  fetchTweetsApi,
  twitterLogoutApi,
} from "../api/twitterHomeTimelineApi";

const TwitterHomeTimeline = ({ loggedIn, setLoggedIn }) => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const tweetsPerPage = 20;

  const fetchTweets = async () => {
    setLoading(true);
    try {
      if (loggedIn) {
        const data = await fetchTweetsApi();
        if (!data) {
          setLoggedIn(false);
          setTweets([]);
          throw new Error("Failed to fetch tweets");
        }
        setTweets(Array.isArray(data) ? data : []); // Ensure tweets is always an array
      } else {
        alert("Session expired. Please log in again.");
        if (typeof window !== "undefined") {
          localStorage.setItem("loggedIn", JSON.stringify(false));
        }
        setLoggedIn(false);
        setTweets([]);
      }
    } catch (error) {
      console.error("Error fetching tweets:", error);
    } finally {
      setLoading(false);
    }
  };

  // const checkSession = async () => {
  //   try {
  //     const response = await fetch("http://localhost:4000/check-session");
  //     if (!response.ok) throw new Error("Failed to check session");
  //     const sessionData = await response.json();
  //     setLoggedIn(sessionData.session_valid);
  //     if (!sessionData.session_valid) {
  //       alert("Session expired. Please log in again.");
  //       setTweets([]);
  //       if (typeof window !== "undefined") {
  //         localStorage.setItem("loggedIn", JSON.stringify(false));
  //       }
  //       setLoggedIn(false);
  //     }
  //   } catch (error) {
  //     console.error("Error checking session:", error);
  //   }
  // };

  const logOut = async () => {
    try {
      const data = await twitterLogoutApi();
      if (data.success) {
        alert("Logout successful!");
        setTweets([]);
        if (typeof window !== "undefined") {
          localStorage.setItem("loggedIn", JSON.stringify(false));
        }
        setLoggedIn(false);
      } else {
        console.log("Logout failed. Please try again!");
        setLoggedIn(true);
      }
    } catch (error) {
      console.error("Error checking session:", error);
    }
  };

  useEffect(() => {
    if (loggedIn) {
      fetchTweets(); // Fetch tweets immediately after login
    }
    // Start checking session one hour after the component mounts
    const sessionCheckTimeout = setTimeout(() => {
      checkSession();
      const intervalId = setInterval(() => {
        checkSession();
      }, 360000); // 1 hour

      return () => clearInterval(intervalId); // Clear interval on unmount
    }, 360000); // 1 hour delay before starting session checks

    return () => clearTimeout(sessionCheckTimeout); // Clear timeout on unmount
  }, [loggedIn]);

  // Calculate the tweets to display based on the current page
  const indexOfLastTweet = currentPage * tweetsPerPage;
  const indexOfFirstTweet = indexOfLastTweet - tweetsPerPage;
  const currentTweets = tweets.slice(indexOfFirstTweet, indexOfLastTweet);

  // Calculate the total number of pages
  const totalPages = Math.ceil(tweets.length / tweetsPerPage);

  return (
    <div>
      <div className="flex justify-between mb-12">
        <button
          className="bg-[#1e8ab9] text-white font-bold py-2 px-4 rounded"
          onClick={fetchTweets}
          disabled={loading}
        >
          {loading ? "Loading..." : "Get New Tweets"}
        </button>
        <button
          className="bg-[#b91e1e] text-white font-bold py-2 px-4 rounded"
          onClick={logOut}
          disabled={loading}
        >
          Twitter Log out
        </button>
      </div>
      <div>
        {tweets.length === 0 ? (
          <p>No tweets available.</p>
        ) : (
          <ul>
            {currentTweets.map((tweet, index) => (
              <li key={index}>
                <div className=" h-[180px] ">
                  <div className="flex w-[300px] mb-2  items-center">
                    <img
                      className="w-[40px] h-[40px] mr-2 rounded-full"
                      src={tweet.profile_image}
                      alt="slika"
                    />
                    <strong className="mr-2">{tweet.name}</strong>
                    <span>
                      ({new Date(tweet.created_at).toLocaleDateString()}):{" "}
                    </span>
                  </div>
                  {/* <span>{tweet.profile_image}</span> */}
                  <p className="text-lg pl-[44px]">{tweet.text}</p>

                  <div className="mt-3 pl-[44px]">
                    <span className="mr-2">
                      Retweets: {tweet.retweet_count},
                    </span>
                    <span>Favorites: {tweet.favorite_count}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Pagination controls */}
      <div className="flex justify-end mt-12">
        <nav>
          <ul className="flex space-x-6">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`bg-black w-8 ${
                  currentPage === index + 1
                    ? "border-b-4 border-green-500"
                    : " "
                }`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default TwitterHomeTimeline;

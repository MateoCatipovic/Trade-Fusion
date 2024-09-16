"use client";
import React, { useState, useEffect } from "react";
import PostItem from "./PostItem";
import SortByDropdown from "./SortByDropdown";
import TimeFilterDropdown from "./TimeFilterDropdown";
import axios from "axios";
import { fetchRedditPosts } from "../api/redditApi";

const SubredditPosts = () => {
  const [redditPosts, setRedditPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subreddits, setSubreddits] = useState([]);
  const [input, setInput] = useState([]);
  const [sortBy, setSortBy] = useState("top"); // Default value is 'top'
  const [timeFilter, setTimeFilter] = useState("week"); // Default value is 'week

  const fetchUserSubreddits = async () => {
    try {
      setLoading(true);
      const data = await fetchRedditPosts(sortBy, timeFilter); // Await the promise to get resolved data
      console.log("Data in frontend:", data.redditPosts); // Now data will be the resolved value
      setRedditPosts(Array.isArray(data.redditPosts) ? data.redditPosts : []); // Ensure the state is always set to an array
      setSubreddits(data.subreddits);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSubreddits = async (e) => {
    e.preventDefault();
    try {
      const csrfToken = localStorage.getItem("csrfToken");
      await axios.post(
        "http://localhost:5000/social/save-subreddit",
        {
          subreddits: input, // Convert comma-separated input to an array
        },
        {
          headers: {
            "X-CSRF-Token": csrfToken,
          },
          withCredentials: true, // Important for cookies
        }
      );
      fetchUserSubreddits(); // Refresh user subreddits after saving
      setInput("");
    } catch (error) {
      setInput("");
      console.error("Failed to save subreddits:", error);
    }
  };

  // Function to delete subreddit
  const handleDeleteSubreddit = async (subreddit) => {
    console.log("subreddit to delete", subreddit);
    try {
      const csrfToken = localStorage.getItem("csrfToken");
      await axios.delete("http://localhost:5000/social/delete-subreddit", {
        headers: {
          "X-CSRF-Token": csrfToken,
        },
        data: {
          subreddit: subreddit, // Send the subreddit data in the request body
        },
        withCredentials: true, // Include cookies
      });

      // Update the state to remove the deleted subreddit
      setSubreddits(subreddits.filter((sub) => sub !== subreddit));
      // Optionally refetch posts if needed
      fetchUserSubreddits();
    } catch (error) {
      console.error("Failed to delete subreddit:", error);
    }
  };

  useEffect(() => {
    fetchUserSubreddits();
  }, [sortBy, timeFilter]);

  return (
    <div>
      {loading ? (
        "Loading..."
      ) : (
        <div>
          <div className="flex justify-between">
            <div className="flex flex-col  justify-between pl-[44px]  mb-[100px] h-[80px] w-[400px]">
              <p className="mb-2">Input subreddit to follow:</p>

              <form onSubmit={handleSaveSubreddits}>
                <input
                  type="text"
                  className="bg-black border-2 border-white focus:border-red-600  placeholder:text-gray h-[40px] w-auto p-4 mr-4  rounded-[10px]   outline-none"
                  placeholder="Enter subreddit..."
                  value={input} // Bind value to state
                  onChange={(e) => setInput(e.target.value)}
                ></input>
                <button className="bg-[#b91e1e] hover:bg-[#b91e1e]/50 text-white font-bold py-2 px-4 rounded">
                  Follow
                </button>
              </form>

              <ul className="flex mt-4">
                {subreddits.map((subreddit, index) => (
                  <li key={index}>
                    <div className="flex bg-slate-600 rounded-[8px] px-4 py-1 text-md mr-4">
                      <p className="mr-2">{subreddit}</p>
                      <button
                        onClick={() => handleDeleteSubreddit(subreddit)}
                        className="hover:text-red-600"
                      >
                        x
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex ">
              <SortByDropdown sortBy={sortBy} setSortBy={setSortBy} />
              {sortBy === "top" && (
                <TimeFilterDropdown
                  timeFilter={timeFilter}
                  setTimeFilter={setTimeFilter}
                />
              )}
            </div>
          </div>
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
      )}
    </div>
  );
};

export default SubredditPosts;

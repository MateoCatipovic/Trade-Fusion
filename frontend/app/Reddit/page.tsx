import React from "react";
import Navbar from "../components/Navbar";
import SubredditPosts from "../components/SubredditPosts"

const Reddit = () => {
  return (
    <div>
      {" "}
      <Navbar />
      <SubredditPosts/>
    </div>
  );
};

export default Reddit;

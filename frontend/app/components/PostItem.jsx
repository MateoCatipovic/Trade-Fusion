import React, { useState } from "react";

const PostItem = ({ post }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const truncateLength = 100; // Number of characters to display before truncation
  
    const toggleExpanded = () => {
      setIsExpanded(!isExpanded);
    };
  
    return (
      <div className="h-auto mb-12">
        <div className="flex w-[300px] mb-2 items-center">
          <img
            className="w-[40px] h-[40px] mr-2 rounded-full"
            src={post.author_profile_image}
            alt="Author"
          />
          <strong className="mr-2">{post.author}</strong>
          <span> ({new Date(post.created_at).toLocaleDateString()}): </span>
        </div>
        <div className=" pl-[44px]">
          <strong className="text-lg ">{post.title}</strong>
          <p className="text-md mt-4">
            {isExpanded ? post.text : `${post.text.slice(0, truncateLength)}...`}
            {post.text.length > truncateLength && (
              <button
                className="text-blue-500 ml-2"
                onClick={toggleExpanded}
              >
                {isExpanded ? "Read less" : "Read more"}
              </button>
            )}
          </p>
        </div>
        <div className="mt-3 pl-[44px]">
          <span className="mr-4">Score: {post.score},</span>
          <span>URL: <a href={post.url} target="_blank" rel="noopener noreferrer">{post.url}</a></span>
        </div>
      </div>
    );
  };

  export default PostItem;
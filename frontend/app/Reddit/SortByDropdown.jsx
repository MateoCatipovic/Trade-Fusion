// SortByDropdown.js
import React from "react";

const SortByDropdown = ({ sortBy, setSortBy }) => {
  return (
    <div className="">
      <label htmlFor="sortBy">Sort By:</label>
      <select
      className="bg-black ml-1"
        id="sortBy"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
      >
        <option value="top">Top</option>
        <option value="new">New</option>
        <option value="hot">Hot</option>
        <option value="rising">Rising</option>
      </select>
    </div>
  );
};

export default SortByDropdown;

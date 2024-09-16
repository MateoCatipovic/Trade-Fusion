// TimeFilterDropdown.js
import React from "react";

const TimeFilterDropdown = ({ timeFilter, setTimeFilter }) => {
  return (
    <div className="ml-8">
      <label htmlFor="timeFilter">Time Filter:</label>
      <select
      className="bg-black ml-1"
        id="timeFilter"
        value={timeFilter}
        onChange={(e) => setTimeFilter(e.target.value)}
      >
        <option value="hour">Hour</option>
        <option value="day">Day</option>
        <option value="week">Week</option>
        <option value="month">Month</option>
        <option value="year">Year</option>
        <option value="all">All Time</option>
      </select>
    </div>
  );
};

export default TimeFilterDropdown;

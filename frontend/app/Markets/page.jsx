"use client"
import React from "react";
import Navbar from "../components/Navbar";
import MarketCharts from "./MarketCharts"

const Markets = () => {
  return (
    <div>
      {" "}
      <Navbar />
      <p className="text-2xl">Markets</p>
      <MarketCharts/>
    </div>
  );
};

export default Markets;

import React from "react";
import useWebSocket from "../../utils/useWebSocket";
import dynamic from "next/dynamic";
const ChartComponent = dynamic(() => import("../components/ChartComponent"), {
  ssr: false, // Disable server-side rendering
});

const MarketCharts = () => {
  const { googleData, btcUsdData, avaxUsdData, appleData } = useWebSocket(
    "ws://localhost:5000/"
  );
  return (
    <div className=" flex flex-col justify-between items-center ">
      <div className="mb-8 w-[900px]">
        <ChartComponent data={googleData} title="GOOGL Price" />
      </div>
      <div className="mb-8 w-[900px]">
        <ChartComponent data={btcUsdData} title="BTC/USD Price" />
      </div>
      <div className="mb-8 w-[900px]">
        <ChartComponent data={avaxUsdData} title="AVAX/USD Price" />
      </div>
      <div className="mb-8 w-[900px]">
        <ChartComponent data={appleData} title="AAPL Price" />
      </div>
    </div>
  );
};

export default MarketCharts;

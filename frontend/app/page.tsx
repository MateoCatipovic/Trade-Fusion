"use client";
// import Image from "next/image";
import { useState, useEffect } from "react";
// import { Line } from "react-chartjs-2";
// import { fetchStocks } from "../lib/api";
// import AlpacaWebSocketCrypto from "./components/AlpacaWebSocketCrypto";
import StocksClient from "./components/StocksClient";
import Navbar from "./components/Navbar";
// import {
//   Chart as ChartJS,
//   LineElement,
//   PointElement,
//   LinearScale,
//   Title,
//   CategoryScale,
//   Legend,
//   ChartOptions,
// } from "chart.js";
// import AlpacaWebSocket from "./components/AlpacaWebSocketCrypto";

// ChartJS.register(
//   LineElement,
//   PointElement,
//   LinearScale,
//   Title,
//   CategoryScale,
//   Legend
// );

export default function Home() {
  const [stocks, setStocks] = useState<any | null>(null);
  const [crypto, setCrypto] = useState([]);
  const [forex, setForex] = useState([]);

  // useEffect(() => {
  //   const getData = async () => {
  //     // const stocksData = await fetchStocks();

  //     // const cryptoData = await fetchCrypto();
  //     // const forexData = await fetchForex();
  //     setStocks(stocksData);
  //     // setCrypto(cryptoData);
  //     // setForex(forexData);
  //   };
  //   getData();
  // }, []);

  // const createChartData = (data: any) => ({
  //   labels: Object.keys(data["Time Series (Daily)"]).reverse(),
  //   datasets: [{
  //     label: 'IBM Stock Price',
  //     data: Object.values(data["Time Series (Daily)"]).reverse().map(item => parseFloat(item['4. close'])),
  //     borderColor: 'rgba(75, 192, 192, 1)',
  //     backgroundColor: 'rgba(75, 192, 192, 0.2)',
  //     fill: false,
  //   }],
  // });

  // const createChartData = (data: any) => {
  //   if (!data || !data["Time Series (30min)"]) {
  //     return {
  //       labels: [],
  //       datasets: [],
  //     };
  //   }

  //   const timeSeries = data["Time Series (30min)"];
  //   const labels = Object.keys(timeSeries).reverse();
  //   const values = Object.values(timeSeries)
  //     .reverse()
  //     .map((item) => parseFloat(item["4. close"]));

  //   return {
  //     labels,
  //     datasets: [
  //       {
  //         label: "IBM Stock Price",
  //         data: values,
  //         borderColor: "rgba(75, 192, 192, 1)",
  //         backgroundColor: "rgba(75, 192, 192, 0.2)",
  //         fill: false,
  //       },
  //     ],
  //   };
  // };

  // const chartOptions: ChartOptions<"line"> = {
  //   responsive: true,
  //   plugins: {
  //     legend: {
  //       position: "top",
  //     },
  //     title: {
  //       display: true,
  //       text: "IBM Stock Price",
  //     },
  //   },
  // };

  return (
    <main className="flex flex-col   ">
      {" "}
      <Navbar isHomePage={true} />
      <div className="bg-home h-screen bg-top-neg-50px">
        <p className="w-[550px] text-2xl mt-12">
          <b className="text-3xl">Connect with Like-Minded Traders:</b>
          <br />
          <br /> Share your thoughts, ideas, and success stories with a
          community that understands your passion for trading. Network,
          collaborate, and grow together as you strive for financial freedom.
        </p>

        {/* <AlpacaWebSocket />
        <AlpacaWebSocketCrypto/> */}
        <div className="mt-12">
          <button className="button-86">Start now</button>
        </div>
      </div>
      <StocksClient />
    </main>
  );
}

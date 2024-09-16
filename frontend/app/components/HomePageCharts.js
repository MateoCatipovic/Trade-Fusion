import React from "react";
import useWebSocket from "../../utils/useWebSocket";
import dynamic from "next/dynamic";
const ChartComponent = dynamic(() => import("./ChartComponent"), {
  ssr: false, // Disable server-side rendering
});

const HomePageCharts = () => {
  // const [googleData, setGoogleData] = useState([]);
  // const [btcUsdData, setBtcUsdData] = useState([]);
  // const [avaxUsdData, setAvaxUsdData] = useState([]);
  // const [ws, setWs] = useState(null);

  // useEffect(() => {
  //   // Create WebSocket connection.
  //   const socket = new WebSocket("ws://localhost:5000");

  //   // Store the WebSocket instance in state
  //   setWs(socket);

  //   // Connection opened
  //   socket.onopen = () => {
  //     console.log("Connected to WebSocket server");
  //   };

  //   // Listen for messages
  //   socket.onmessage = (event) => {
  //     const data = JSON.parse(event.data);
  //     console.log("Received data:", data);

  //     if (Array.isArray(data)) {
  //       // Process new data for each symbol
  //       processData(data, "GOOGL", setGoogleData);
  //       processData(data, "BTC/USD", setBtcUsdData);
  //       processData(data, "AVAX/USD", setAvaxUsdData);
  //     }
  //   };

  //   // Handle errors
  //   socket.onerror = (error) => {
  //     console.error("WebSocket error:", error);
  //   };

  //   // Cleanup on component unmount
  //   return () => {
  //     socket.close();
  //     console.log("Disconnected from WebSocket server");
  //   };
  // }, []);

  // // Function to process new data
  // const processData = (data, symbol, setData) => {
  //   const newData = data
  //     .filter((item) => item.S === symbol)
  //     .map((item) => ({
  //       time: new Date(item.t),
  //       price: item.ap,
  //     }));

  //   setData((prevData) => {
  //     const lastRecordedPrice = lastPrice[symbol];
  //     const filteredData = newData.filter((item) => {
  //       if (lastRecordedPrice === null || item.price !== lastRecordedPrice) {
  //         // Update last recorded price
  //         setLastPrice((prevLastPrice) => ({
  //           ...prevLastPrice,
  //           [symbol]: item.price,
  //         }));
  //         return true;
  //       }
  //       return false;
  //     });

  //     // Update state with filtered data
  //     return [...prevData, ...filteredData];
  //   });
  // };

  // function setChartData(data) {
  //   const chartData = {
  //     labels: data.map((point) => point.time),
  //     datasets: [
  //       {
  //         label: "Price",
  //         data: data.map((point) => point.price),
  //         fill: true,
  //         backgroundColor: "rgba(75,192,192,0.4)",
  //         borderColor: "rgba(75,192,192,1)",
  //         pointRadius: function (context) {
  //           const index = context.dataIndex;
  //           const count = context.dataset.data.length;
  //           return index === count - 1 ? 5 : 0; // Show dot on the last data point only
  //         },
  //       },
  //     ],
  //   };
  //   return chartData;
  // }
  // const googleChartData = setChartData(googleData);
  // const btcUsdChartData = setChartData(btcUsdData);
  // const avaxUsdChartData = setChartData(avaxUsdData);

  // const chartData = {
  //   labels: trimmedData.map((point) => point.time),
  //   datasets: [
  //     {
  //       label: "Price",
  //       data: trimmedData.map((point) => point.price),
  //       fill: true,
  //       backgroundColor: "rgba(75,192,192,0.4)",
  //       borderColor: "rgba(75,192,192,1)",
  //       pointRadius: function (context) {
  //         const index = context.dataIndex;
  //         const count = context.dataset.data.length;
  //         return index === count - 1 ? 5 : 0; // Show dot on the last data point only
  //       },
  //     },
  //   ],
  // };

  // const options = {
  //   scales: {
  //     x: {
  //       type: "time", // Use 'time' scale
  //       time: {
  //         unit: "minute",
  //       },
  //       adapters: {
  //         date: "date-fns", // Specify the date adapter
  //       },
  //     },
  //     y: {
  //       beginAtZero: false,
  //       ticks: {
  //         callback: function (value) {
  //           return value.toFixed(2); // Formatting to two decimal places
  //         },
  //       },
  //     },
  //   },
  // };
  const { googleData, btcUsdData, avaxUsdData, appleData } = useWebSocket(
    "ws://localhost:5000/"
  );

  return (
    <div className="w-auto h-[700px]">
      <h1>Real-Time Stock Prices</h1>
      <div className="flex w-full h-ful">
        <div className="flex-1 mr-2 ">
          <ChartComponent data={googleData} title="GOOGL Price" />
        </div>
        <div className="flex flex-col justify-between gap-2 ">
          <div>
            <ChartComponent data={btcUsdData} title="BTC/USD Price" />
          </div>
          <div>
            <ChartComponent data={avaxUsdData} title="AVAX/USD Price" />
          </div>
          <div>
            <ChartComponent data={appleData} title="AAPL Price" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePageCharts;

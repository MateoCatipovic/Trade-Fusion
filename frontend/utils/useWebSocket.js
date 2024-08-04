import { useState, useEffect } from "react";
import { fetchHistoricalData } from "../app/api/historicalApi";

const useWebSocket = (url) => {
  const [googleData, setGoogleData] = useState([]);
  const [btcUsdData, setBtcUsdData] = useState([]);
  const [avaxUsdData, setAvaxUsdData] = useState([]);
  const [lastPrice, setLastPrice] = useState({
    GOOGL: null,
    "BTC/USD": null,
    "AVAX/USD": null,
  });

  useEffect(() => {
    const loadHistoricalData = async () => {
      const googleData = await fetchHistoricalData("stock", "GOOGL");
      const btcData = await fetchHistoricalData("crypto", "BTC/USD");
      const avaxData = await fetchHistoricalData("crypto", "AVAX/USD");
      console.log("Google data:", googleData);
      console.log("BTC data:", btcData);
      console.log("AVAX data:", avaxData);
      if (googleData) {
        setGoogleData(
          googleData.map((d) => ({ time: new Date(d.t), price: d.c }))
        );
      }
      if (btcData) {
        setBtcUsdData(
          btcData.map((d) => ({ time: new Date(d.t), price: d.c }))
        );
      }
      if (avaxData) {
        setAvaxUsdData(
          avaxData.map((d) => ({ time: new Date(d.t), price: d.c }))
        );
      }
    };
    loadHistoricalData();
  }, []);
  
  useEffect(() => {
    const socket = new WebSocket(url);

    socket.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received data:", data);

      if (Array.isArray(data)) {
        processData(data, "GOOGL", setGoogleData);
        processData(data, "BTC/USD", setBtcUsdData);
        processData(data, "AVAX/USD", setAvaxUsdData);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      socket.close();
      console.log("Disconnected from WebSocket server");
    };
  }, [url]);

  const processData = (data, symbol, setData) => {
    const newData = data
      .filter((item) => item.S === symbol)
      .map((item) => ({
        time: new Date(item.t),
        price: item.p,
      }));

    setData((prevData) => {
      const lastRecordedPrice = lastPrice[symbol];
      const filteredData = newData.filter((item) => {
        if (lastRecordedPrice === null || item.price !== lastRecordedPrice) {
          setLastPrice((prevLastPrice) => ({
            ...prevLastPrice,
            [symbol]: item.price,
          }));
          return true;
        }
        return false;
      });

      return [...prevData, ...filteredData];
    });
  };

  return { googleData, btcUsdData, avaxUsdData };
};

export default useWebSocket;

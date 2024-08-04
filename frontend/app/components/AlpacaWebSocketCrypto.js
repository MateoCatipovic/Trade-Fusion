import { useEffect, useState } from "react";


const AlpacaWebSocket = () => {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Define the WebSocket URL
    const url = "wss://stream.data.alpaca.markets/v1beta3/crypto/us";
    const apiKey = process.env.NEXT_PUBLIC_ALPACA_API_KEY;
    const secretKey = process.env.NEXT_PUBLIC_ALPACA_SECRET_KEY;
    console.log(apiKey);

    // Initialize WebSocket connection
    const ws = new WebSocket(url);

    // Connection opened
    ws.onopen = () => {
      console.log("Connected to Alpaca WebSocket");
      setIsConnected(true);
      // Authenticate after connection opens
      ws.send(
        JSON.stringify({
          action: "auth",
          key: apiKey,
          secret: secretKey,
        })
      );
    };

    // Listen for messages
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received data:", data);
      setMessages((prev) => [...prev, data]);

      // Example of subscribing to a symbol after authentication
      if (
        data.some(
          (message) =>
            message.T === "success" && message.msg === "authenticated"
        )
      ) {
        ws.send(
          JSON.stringify({
            action: "subscribe",
            trades: ["BTC/USD"], // Subscribe to test symbol
            quotes: ["AVAX/USD"],
          })
        );
      }
    };

    // Connection closed
    ws.onclose = () => {
      console.log("Disconnected from Alpaca WebSocket");
      setIsConnected(false);
    };

    // Handle errors
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div>
      <h2>Alpaca WebSocket Client</h2>
      <p>Connection status: {isConnected ? "Connected" : "Disconnected"}</p>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{JSON.stringify(message)}</li>
        ))}
      </ul>
    </div>
  );
};

export default AlpacaWebSocket;

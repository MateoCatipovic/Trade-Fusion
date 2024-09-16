"use client";
import { useState } from "react";
import { twitterLoginApi } from "../api/twitterLogInApi";

const TwitterLogin = ({ loggedIn, setLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await twitterLoginApi(username, email, password);

      if (data.success) {
        alert("Login successful!");
        if (typeof window !== "undefined") {
          console.log("Storing loggedIn as true in localStorage");
          localStorage.setItem("loggedIn", JSON.stringify(true));
        }
        setLoggedIn(true);
      } else {
        setError("Login failed. Please check your credentials.");
        if (typeof window !== "undefined") {
          console.log("Storing loggedIn as false in localStorage");
          localStorage.setItem("loggedIn", JSON.stringify(false));
        }
        setLoggedIn(false);
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="">
      <h1 className="text-3xl mb-4">Login to your X account</h1>
      <form className="w-[400px]" onSubmit={handleLogin}>
        <div className="flex flex-col mt-2">
          <label htmlFor="username">Username:</label>
          <input
            className="text-white bg-black p-2 rounded-[10px] border-2 border-white mt-2 "
            type="text"
            id="username"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col mt-2">
          <label htmlFor="email">Email:</label>
          <input
            className="text-white bg-black p-2 rounded-[10px] border-2 border-white mt-2 "
            type="email"
            id="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col mt-2">
          <label htmlFor="password">Password:</label>
          <input
            className="text-white bg-black p-2 rounded-[10px] border-2 border-white mt-2 "
            type="password"
            id="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          type="submit"
        >
          Login
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default TwitterLogin;

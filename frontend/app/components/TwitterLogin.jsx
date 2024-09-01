"use client";
import { useState } from "react";
import {twitterLoginApi} from "../api/twitterLogInApi";

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
      <h1 className="text-3xl ">Login to your X account</h1>
      <form className="w-[400px]" onSubmit={handleLogin}>
        <div className="flex flex-col">
          <label htmlFor="username">Username:</label>
          <input
            className="text-black"
            type="text"
            id="username"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="email">Email:</label>
          <input
            className="text-black"
            type="email"
            id="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password">Password:</label>
          <input
            className="text-black"
            type="password"
            id="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="mt-4 text-white" type="submit">
          Login
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default TwitterLogin;

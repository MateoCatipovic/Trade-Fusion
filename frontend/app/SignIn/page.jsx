"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { logIn } from "../api/logInApi";

const SignIn = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    // Get the target element
    const targetDiv = document.getElementById("email-div");

    // Scroll to the target div if it exists
    if (targetDiv) {
      targetDiv.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const handleLogin = async () => {
    try {
      const { message } = await logIn(
        emailOrUsername,
        password
      ); 

      // Handle successful login
      console.log("Login successful:", message);
      window.location.href = "/";
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="">
      <Navbar isHomePage={false}/>
      <div className="relative bg-sign-in h-[700px] w-full bg-cover bg-center ">
        {/* Gradients */}
        <div
          id="email-div"
          className="absolute inset-0 h-[250px]  w-full bg-gradient-to-t  to-black from-transparent"
        ></div>
        <div className="absolute bottom-0 h-[250px]  w-full  bg-gradient-to-b  to-black from-transparent"></div>

        {/* Frosted Glass Effect */}
        <div className="backdrop-blur-[4px] h-[700px] w-full pt-[200px]">
          <div className="flex flex-col  items-center justify-between h-[250px] w-[560px] m-auto">
            <p className="text-[40px]  font-semibold ">Log in</p>
            <input
              className="bg-black/50 placeholder:text-white h-[40px] w-full p-4 rounded-[10px] focus:border-2  focus:border-green-600 outline-none"
              placeholder="Email/profile name"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
            ></input>
            <input
              type="password"
              className="bg-black/50 placeholder:text-white h-[40px] w-full p-4 rounded-[10px] focus:border-2  focus:border-green-600 outline-none"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
            <button
              className="mt-4 bg-green-600 hover:bg-green-800 text-white p-2 rounded-lg drop-shadow-2xl w-full"
              onClick={handleLogin}
            >
              Log in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

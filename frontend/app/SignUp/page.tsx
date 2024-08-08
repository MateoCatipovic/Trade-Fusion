"use client"
import React, { useEffect } from "react";
import Navbar from "../components/Navbar";

const SignUp = () => {
  useEffect(() => {
    // Get the target element
    const targetDiv = document.getElementById("profile-div");

    // Scroll to the target div if it exists
    if (targetDiv) {
      targetDiv.scrollIntoView({ behavior: "smooth" });
    }
  }, []);
  return (
    <div className="">
      <Navbar />
      <div className="relative bg-sign-up h-[700px] w-full bg-cover bg-center pt-[200px]">
        <div className="absolute inset-0 h-[250px]  w-full bg-gradient-to-t  to-black from-transparent"></div>
        <div className="flex flex-col items-center justify-between h-[400px]">
          <p className="text-[40px]  font-semibold ">Register account</p>
          <input
            className="bg-black/50 placeholder:text-white h-[40px] w-[560px] p-4 rounded-[10px] focus:border-2  focus:border-red-600 outline-none"
            placeholder="Email"
          ></input>
          <input
            id="profile-div"
            className="bg-black/50 placeholder:text-white h-[40px] w-[560px] p-4 rounded-[10px] focus:border-2  focus:border-red-600 outline-none"
            placeholder="Profile name"
          ></input>
          <input
            className="bg-black/50 placeholder:text-white h-[40px] w-[560px] p-4 rounded-[10px] focus:border-2  focus:border-red-600 outline-none"
            placeholder="Password"
          ></input>
          <input
            className="bg-black/50 placeholder:text-white h-[40px] w-[560px] p-4 rounded-[10px] focus:border-2  focus:border-red-600 outline-none"
            placeholder="Confirm password"
          ></input>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

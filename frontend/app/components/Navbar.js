"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {logOut} from "../../utils/logOut"

const Navbar = ({ isHomePage }) => {
  const [username, setUsername] = useState("");
  //const { logOut } = useAuth();

  useEffect(() => {
    const name = localStorage.getItem("username", username);
    if (name) {
      setUsername(name);
    }
  }, []);

  const handleLogout = async () => {
    try {
      setUsername("");
      await logOut();
      
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  return (
    <>
      <div
        className={`flex items-center justify-between w-full  ${
          isHomePage ? "" : "mb-12"
        }`}
      >
        <Link href="/" scroll={false}>
          <Image
            src="/logo.png"
            width={100}
            height={100}
            alt="Picture of the author"
          />
        </Link>
        <div className="flex w-[500px] justify-between">
          <Link href="/News" scroll={false}>
            News
          </Link>
          <Link href="/Twitter" scroll={false}>
            Twitter
          </Link>
          <Link href="/Reddit" scroll={false}>
            Reddit
          </Link>
          <Link href="/Markets" scroll={false}>
            Markets
          </Link>
          <Link href="/Forum" scroll={false}>
            Forum
          </Link>
          <Link href="/Brokers" scroll={false}>
            Brokers
          </Link>
        </div>
        <div>
          {username ? (
            <div className="flex">
              <p className="mr-3">{username}</p>
              <button
                onClick={handleLogout}
                className="text-green-400 font-bold "
              >
                Log out
              </button>
            </div>
          ) : (
            <div>
              {" "}
              <Link href="/SignIn" scroll={false}>
                <button className="text-green-400 font-bold pr-4">
                  Sign in
                </button>
              </Link>
              <Link href="/SignUp" scroll={false}>
                <button className="bg-[#1eb969] hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                  Sign up
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;

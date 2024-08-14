import React from "react";
import Image from "next/image";
import Link from "next/link";
// import { headers } from "next/headers";

const Navbar = ({ isHomePage }) => {
  // const headerList = headers();
  // const pathname = headerList.get("x-current-path");
  // console.log(pathname);
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
          <Link href="/SignIn" scroll={false}>
            <button className="text-green-400 font-bold pr-4">Sign in</button>
          </Link>
          <Link href="/SignUp" scroll={false}>
            <button className="bg-[#1eb969] hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Sign up
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;

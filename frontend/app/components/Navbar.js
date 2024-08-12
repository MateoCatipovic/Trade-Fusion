
import React from "react";
import Image from "next/image";
import Link from "next/link";


const Navbar = ({isHomePage}) => {
  return (
    <>
      <div className={`flex items-center justify-between w-full  ${isHomePage ? "" : "mb-12"}`}>
        <Link href="/">
          <Image
            src="/logo.png"
            width={100}
            height={100}
            alt="Picture of the author"
          />
        </Link>
        <div className="flex w-[500px] justify-between">
          <Link href="/News">News</Link>
          <Link href="/Twitter">Twitter</Link>
          <Link href="/Reddit">Reddit</Link>
          <Link href="/Markets">Markets</Link>
          <Link href="/Forum">Forum</Link>
          <Link href="/Brokers">Brokers</Link>
        </div>
        <div>
          <Link href="/SignIn">
            <button className="text-green-400 font-bold pr-4">Sign in</button>
          </Link>
          <Link href="/SignUp">
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

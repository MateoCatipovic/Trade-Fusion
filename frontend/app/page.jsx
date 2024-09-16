"use client";
import HomePageCharts from "./components/HomePageCharts";
import Navbar from "./components/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col">
      {" "}
      <Navbar isHomePage={true} />
      <div className="bg-home bg-cover h-screen bg-top-neg-50px">
        <p className="w-[550px] text-2xl mt-12">
          <b className="text-3xl">Connect with Like-Minded Traders:</b>
          <br />
          <br /> Share your thoughts, ideas, and success stories with a
          community that understands your passion for trading. Network,
          collaborate, and grow together as you strive for financial freedom.
        </p>
        <div className="mt-12">
          <Link href="/SignUp" scroll={false}>
            <button className="button-86">Start now</button>
          </Link>
        </div>
      </div>
      <div>
        <HomePageCharts />
      </div>
    </main>
  );
}

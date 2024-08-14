import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faDiscord,
  faLinkedin,
  faYoutube,
  faReddit,
} from "@fortawesome/free-brands-svg-icons";

const Contacts = () => {
  return (
    <div className="mb-[120px] mt-[120px]">
      <p className="text-2xl mb-10 font-semibold">Contacts</p>
      <div className="flex items-center justify-between mb-12">
        <div className="flex  items-center">
          <Link href="/" scroll={false}>
            <Image src="/logo.png" width={100} height={100} alt="logo" />
          </Link>
          <p className="">TRADE FUSION</p>
        </div>
        <div className="flex justify-between w-[300px]">
          <div>
            <Link
              href="https://www.linkedin.com/in/mateo-catipovic-9b2588243/"
              target="_blank"
              rel="noopener noreferrer"
              scroll={false}
            >
              <FontAwesomeIcon icon={faLinkedin} />
            </Link>
          </div>
          <div>
            <Link
              href="https://x.com/home"
              target="_blank"
              rel="noopener noreferrer"
              scroll={false}
            >
              <FontAwesomeIcon icon={faTwitter} />{" "}
            </Link>
          </div>
          <div>
            <Link
              href="https://web.facebook.com/?_rdc=1&_rdr"
              target="_blank"
              rel="noopener noreferrer"
              scroll={false}
            >
              <FontAwesomeIcon icon={faFacebook} />
            </Link>
          </div>
          <div>
            <Link
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              scroll={false}
            >
              <FontAwesomeIcon icon={faInstagram} />
            </Link>
          </div>
          <div>
            <Link
              href="https://www.reddit.com/"
              target="_blank"
              rel="noopener noreferrer"
              scroll={false}
            >
              <FontAwesomeIcon icon={faReddit} />
            </Link>
          </div>
          <div>
            <Link
              href="https://discord.com/"
              target="_blank"
              rel="noopener noreferrer"
              scroll={false}
            >
              <FontAwesomeIcon icon={faDiscord} />
            </Link>
          </div>
          <div>
            <Link
              href="https://www.youtube.com/"
              target="_blank"
              rel="noopener noreferrer"
              scroll={false}
            >
              <FontAwesomeIcon icon={faYoutube} />
            </Link>
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="flex justify-between w-[150px] ml-12">
          <div className="flex flex-col justify-between h-[130px]">
            <Link href="/News">News</Link>
            <Link href="/Twitter">Twitter</Link>
            <Link href="/Reddit">Reddit</Link>
          </div>
          <div className="flex flex-col justify-between h-[130px]">
            <Link href="/Markets">Markets</Link>
            <Link href="/Forum">Forum</Link>
            <Link href="/Brokers">Brokers</Link>
          </div>
        </div>
        <div className="flex">
          <p className="text-[23px]">
            Need assistance? <br />
            Chat with our AI bot!
          </p>
          <Image
            src="/ai-chatbot-app2.png"
            width={200}
            height={200}
            alt="logo"
          />
        </div>
      </div>
    </div>
  );
};

export default Contacts;

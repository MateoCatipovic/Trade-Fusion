"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { fetchNews } from "../api/newsApi";
import Link from "next/link";
import { sortArticles } from "../../utils/sortAlgoritm.js";
import { formatTimestamp } from "../../utils/dateFormat";

const News = () => {
  const [activeButton, setActiveButton] = useState("Stocks");
  const [news, setNews] = useState([]); // Use 'any' or define a type for news articles
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc"); // 'asc' for ascending, 'desc' for descending
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 9;

  const forexImg =
    "https://www.unimoni.in/blog/wp-content/uploads/2019/11/Forex-Payment-Processing-860x560-1.webp";
  const stocksImg =
    "https://www.thebalancemoney.com/thmb/oogn7pi9WI9exh6Ags-il6bUfRQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/dotdash-TheBalance-what-are-stocks-3306181-Final-75b1bb359b7141d9a22cb1b706f2cf2f.jpg";
  const cryptoImg =
    "https://news.northeastern.edu/wp-content/uploads/2024/03/bitcon_1400.jpeg?w=1024";

  // Fetch news based on active button when it changes
  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchNews(activeButton);

        if (data && Array.isArray(data.articles)) {
          console.log("DATA ", data.articles);

          // Modify the seendate of each article
          const formattedArticles = data.articles.map((article) => {
            //console.log("Original seendate:", article.seendate);
            return {
              ...article,
              seendate: formatTimestamp(article.seendate),
            };
          });
          setNews(formattedArticles);
        } else {
          setError("Invalid data structure");
        }
      } catch (err) {
        setError("Failed to fetch news");
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, [activeButton]); // Fetch news when `activeButton` changes

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  const handleSortButtonClick = () => {
    setSortOrder((prevOrder) => (prevOrder === "desc" ? "asc" : "desc"));
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Get current articles based on pagination
  const currentArticles = sortArticles(news, sortOrder).slice(
    (currentPage - 1) * articlesPerPage,
    currentPage * articlesPerPage
  );

  // Calculate total pages
  const totalPages = Math.ceil(news.length / articlesPerPage);

  return (
    <div>
      {" "}
      <Navbar />
      <p className="text-3xl font-semibold mb-10">News</p>
      {/* Sort Button */}
      <button onClick={handleSortButtonClick} className="mb-5">
        Sort by Date ({sortOrder === "asc" ? "Oldest" : "Latest"})
      </button>
      <div className="flex w-[250px] justify-between mb-12">
        <button
          onClick={() => handleButtonClick("Stocks")}
          className={`${
            activeButton === "Stocks" ? "border-b-4 border-green-500" : ""
          }`}
        >
          Stocks
        </button>
        <button
          onClick={() => handleButtonClick("Crypto")}
          className={`${
            activeButton === "Crypto" ? "border-b-4 border-green-500" : ""
          }`}
        >
          Crypto
        </button>
        <button
          onClick={() => handleButtonClick("Forex")}
          className={`${
            activeButton === "Forex" ? "border-b-4 border-green-500" : ""
          }`}
        >
          Forex
        </button>
      </div>
      {/* Display news articles based on the active button */}
      <div className="flex flex-wrap justify-between gap-12">
        {currentArticles.map((article, index) => (
          <div className="w-[30%] max-w-full max-h-full box-border" key={index}>
            <Link href={article.url} target="_blank" rel="noopener noreferrer">
              {article.socialimage ? (
                <img
                  className="w-full h-[250px]"
                  src={article.socialimage}
                  alt={article.title}
                />
              ) : activeButton === "Stocks" ? (
                <img
                  className="w-full h-[250px]"
                  src={stocksImg}
                  alt={article.title}
                />
              ) : activeButton === "Crypto" ? (
                <img
                  className="w-full h-[250px]"
                  src={cryptoImg}
                  alt={article.title}
                />
              ) : (
                <img
                  className="w-full h-[250px]"
                  src={forexImg}
                  alt={article.title}
                />
              )}

              <h2 className="font-semibold">{article.title}</h2>
              </Link>
            <p>{article.seendate}</p>
          </div>
        ))}
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-end mt-12">
        <nav>
          <ul className="flex space-x-6">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNumber) => (
                <li key={pageNumber}>
                  <button
                    onClick={() => handlePageChange(pageNumber)}
                    className={`bg-black w-8 ${
                      currentPage === pageNumber
                        ? "border-b-4 border-green-500"
                        : " "
                    }`}
                  >
                    {pageNumber}
                  </button>
                </li>
              )
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default News;

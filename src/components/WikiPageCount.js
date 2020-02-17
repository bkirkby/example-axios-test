import React, { useState, useEffect } from "react";
import axios from "axios";

const WikiPageCount = () => {
  const [title, setTitle] = useState("Lambda");
  const [url, setUrl] = useState(
    `https://en.wikipedia.org/w/api.php?format=json&action=query&prop=info|pageviews|links&titles=Lambda&origin=*`
  );
  const [nextTitle, setNextTitle] = useState();
  const [pageviews, setPageviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    axios.get(url).then(res => {
      const idx = Object.keys(res.data.query.pages)[0];
      const randomLink = Math.floor(
        Math.random() * res.data.query.pages[idx].links.length
      );
      setPageviews(res.data.query.pages[idx].pageviews);
      setNextTitle(res.data.query.pages[idx].links[randomLink].title);
      setIsLoading(false);
    });
  }, [url]);

  useEffect(() => {
    setUrl(
      `https://en.wikipedia.org/w/api.php?format=json&action=query&prop=info|pageviews|links&titles=${encodeURI(
        title
      )}&origin=*`
    );
  }, [title]);

  const handleNext = () => {
    setTitle(nextTitle);
  };
  return (
    <>
      <h1>
        <a
          href={`https://en.wikipedia.org/wiki/${encodeURI(title)}`}
          target="_blank"
        >
          {title}
        </a>
      </h1>
      <button onClick={handleNext}>next</button>
      <h2>pageviews:</h2>
      {isLoading ? (
        <h2>**loading data**</h2>
      ) : (
        Object.keys(pageviews)
          .reverse()
          .map((date, idx) => {
            return (
              <h2 data-testid="pageview-count" key={idx}>
                {date}: {pageviews[date] ? pageviews[date] : 0}
              </h2>
            );
          })
      )}
    </>
  );
};

export default WikiPageCount;

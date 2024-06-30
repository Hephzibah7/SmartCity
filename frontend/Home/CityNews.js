import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const CityNews = () => {
  const [news, setNews] = useState([]);
  const location = useLocation();

  const getQueryParams = (query) => {
    return new URLSearchParams(query);
  };

  useEffect(() => {
    const queryParams = getQueryParams(location.search);
    const state = queryParams.get('state');
    console.log(state);
    if (state) {
      fetchNews(state);
    }
  }, [location.search]);

  const fetchNews = async (state) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { state },
      };
      const response = await axios.get(`http://localhost:9002/news`, config);
      console.log(response);
      setNews(response.data.articles);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  return (
    <div className="my-8 container mx-auto">
      <h2 className="text-xl font-bold mb-4">City News</h2>
      <div className="h-96 overflow-y-scroll">
        <ul>
          {news.length > 0 ? (
            news.map((article, index) => (
              <li key={index}>
                <a
                  href={article.url}
                  className="text-blue-500 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {article.title}
                </a>
              </li>
            ))
          ) : (
            <li>No news available for the selected state.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default CityNews;

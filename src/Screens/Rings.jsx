import React, { useState, useEffect } from 'react';
import ArticlesList from '../components/ArticleList.jsx';
import loadGif from '../assets/load.webp';
import '../style/App.css';
import { http } from '../config.jsx';

const Rings = () => {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(`${http}/articles/rings?page=${page}&pageSize=${pageSize}`);
        const data = await response.json();
        if (page === 1) {
          setArticles(data);
        } else {
          setArticles(prevArticles => [...prevArticles, ...data]);
        }
      } catch (error) {
        console.error('Error fetching rings:', error);
      }
    };
    fetchArticles();
  }, [page, pageSize]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight
      ) {
        setPage(prevPage => prevPage + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div>
      <div className='list-articles'>
      {articles.length > 0 ? (
          <ArticlesList articles={articles} />
        ) : (
          <img src={loadGif} alt="load" width={100}/>
        )}
      </div>
    </div>
  );
}

export default Rings;
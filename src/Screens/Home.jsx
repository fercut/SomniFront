import React, { useState, useEffect } from 'react';
import ArticlesList from '../components/ArticleList.jsx';
import Search from '../components/Search';
import loadGif from '../assets/load.webp';
import '../style/App.css';
import { http } from '../config.jsx';

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchEmpty, setIsSearchEmpty] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(`${http}/articles/home?page=${page}&pageSize=${pageSize}`);
        const data = await response.json();
        if (page === 1) {
          setArticles(data);
        } else {
          setArticles(prevArticles => [...prevArticles, ...data]);
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
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
  
  const handleSearch = (searchTerm) => {
    setIsSearchEmpty(searchTerm === '');
  
    if (searchTerm === '') {
      setSearchResults([]);
    } else {
      fetch(`${http}/articles/search/${searchTerm}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Error al realizar la búsqueda en somniapi.onrender.com');
          }
          return response.json();
        })
        .then((data) => {
          setSearchResults(data);
        })
        .catch((error) => {
          console.error('Error al realizar la búsqueda en somniapi.onrender.com:', error);
        });
    }
  };
  
  return (
    <div className='home'>
      <div className="search-container">
        <Search onSearch={handleSearch} />
      </div>
      <h2>ULTIMAS NOVEDADES</h2>
      <div className='list-articles'>
        {isSearchEmpty ? (
          articles.length > 0 ? (
            <ArticlesList articles={articles} />
          ) : (
            <img src={loadGif} alt="load" width={100} />
          )
        ) : (
          <ArticlesList articles={searchResults} />
        )}
      </div>
    </div>
  );
};

export default Home;

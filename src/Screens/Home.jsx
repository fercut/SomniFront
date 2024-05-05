import React, { useState, useEffect } from 'react';
import ArticlesList from '../components/ArticleList.jsx';
import Search from '../components/Search';
import loadGif from '../assets/load.webp';
import '../style/App.css';
import { http } from '../config.jsx';

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchEmpty, setIsSearchEmpty] = useState(true);

  useEffect(() => {
    fetch(`${http}/articles/home`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener los artículos desde somniapi.onrender.com');
        }
        return response.json();
      })
      .then((data) => setArticles(data))
      .catch((error) => console.error('Error al obtener los artículos desde somniapi.onrender.com:', error));
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

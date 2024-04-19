import React, { useState, useEffect } from 'react';
import ArticlesList from '../components/ArticleList.jsx';
import Search from '../components/Search';
import loadGif from '../assets/load.webp';
import '../style/App.css';

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchEmpty, setIsSearchEmpty] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/articles/home')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener los artículos desde localhost:3000');
        }
        return response.json();
      })
      .then((data) => setArticles(data))
      .catch((error) => {
        console.error('Intentando con la segunda URL');
        // Intentar con la segunda URL si la primera solicitud falla
        fetch('https://somniapi.onrender.com/articles/home')
          .then((response) => response.json())
          .then((data) => setArticles(data))
          .catch((error) => console.error('Error al obtener los artículos desde la segunda URL'));
      });
  }, []);

  const handleSearch = (searchTerm) => {
    setIsSearchEmpty(searchTerm === '');

    if (searchTerm === '') {
      setSearchResults([]);
    } else {
      // Realiza la búsqueda solo si la barra de búsqueda no está vacía
      fetch(`http://localhost:3000/articles/search/${searchTerm}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Error al realizar la búsqueda en localhost:3000');
          }
          return response.json();
        })
        .then((data) => {
          setSearchResults(data); // Establecer los resultados de la búsqueda
        })
        .catch((error) => {
          console.error(error.message); // Registrar el error en la consola
          console.log('Intentando la búsqueda en somniapi.onrender.com');
          fetch(`https://somniapi.onrender.com/articles/search/${searchTerm}`)
            .then((response) => response.json())
            .then((data) => setSearchResults(data))
            .catch((error) => console.error('Error al realizar la búsqueda en somniapi.onrender.com:', error));
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

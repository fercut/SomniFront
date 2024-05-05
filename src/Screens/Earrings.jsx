import React, { useState, useEffect } from 'react';
import ArticlesList from '../components/ArticleList.jsx';
import loadGif from '../assets/load.webp';
import '../style/App.css';
import { http } from '../config.jsx';

const Earrings = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch(`${http}/articles/earrings`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener los artículos desde localhost:3000');
        }
        return response.json();
      })
      .then((data) => {
        setArticles(data);
      })
      .catch((error) => {
        console.error(error.message); 
      });
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

export default Earrings;
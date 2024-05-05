import React, { useState, useEffect } from 'react';
import ArticlesList from '../components/ArticleList.jsx';
import loadGif from '../assets/load.webp';
import '../style/App.css';

const Pendants = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch(`${process.env.CONECTION}/articles/pendants`)
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

export default Pendants;
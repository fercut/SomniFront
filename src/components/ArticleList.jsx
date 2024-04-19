import React from 'react';
import ArticleCard from './ArticleCard.jsx'; 

const ArticlesList = ({ articles }) => {
  const handleBuyClick = (articleId) => {
    console.log(`Artículo comprado con ID: ${articleId}`);
  };

  return (
    <div className="articles-list">
      {articles.map((article, index) => (
        <ArticleCard key={index} article={article} onBuyClick={handleBuyClick} />
      ))}
    </div>
  );
};

export default ArticlesList;

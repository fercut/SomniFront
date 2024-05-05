import React, { useState, useEffect } from 'react';


const OrderDetail = ({ order, onClose }) => {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        const fetchArticleDetails = async () => {
          try {
            //TODO problemas con las unidades y extraccion de datos
            const articleDetails = await Promise.all(order.article.articleId.map(async articleId => {
              console.log(articleId);
              const responseLocal = await fetch(`http://localhost:3000/articles/get/${articleId}`);
              if (responseLocal.ok) {
                const localArticleDetail = await responseLocal.json();
                return localArticleDetail;
              } else {
                throw new Error('Error al obtener los detalles del artículo desde localhost');
              }
            }));
            setArticles(articleDetails);
            console.log(articleDetails);
          } catch (error) {
            console.error('Error al obtener los detalles de los artículos desde localhost:', error);
            // Intentar con la segunda URL si la primera solicitud falla
            try {
              const articleDetailsRender = await Promise.all(order.article.articleId.map(async articleId => {
                const responseRender = await fetch(`https://somniapi.onrender.com/articles/get/${articleId}`);
                if (responseRender.ok) {
                  const renderArticleDetail = await responseRender.json();
                  return renderArticleDetail;
                } else {
                  throw new Error('Error al obtener los detalles del artículo desde somniapi.onrender.com');
                }
              }));
              setArticles(articleDetailsRender);
              console.log(articleDetailsRender);
            } catch (error) {
              console.error('Error en la solicitud a somniapi.onrender.com:', error);
            }
          }
        };
      
        fetchArticleDetails();
      }, [order]);
      
    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Detalles del pedido</h2>
                <span className="close" onClick={onClose}>&times;</span>
                <h3>Artículos del pedido</h3>
                <div className="articles">
                    {articles.map(article => (
                        <div key={article._id} className="article-card">
                        <div className="article-image">
                            <img src={`data:image/jpeg;base64,${article.image}`} width={'100'} alt="Imagen del artículo" />
                        </div>
                        <div className='article-details'>
                            <p><b>Nombre: </b>{article.details}</p>
                            <p><b>Unidades: </b>{}</p>
                            <p><b>Precio:</b> {article.price}€</p>
                        </div>
                    </div>
                    ))}
                </div>
                <hr />
                <p><b>Fecha:</b> {new Date(order.date).toLocaleDateString()}</p>
                <p><b>Número de pedido:</b> {order._id}</p>
                <p><b>Precio total:</b> {order.price}€</p>
            </div>
        </div>
    );
};

export default OrderDetail;
import React, { useState } from 'react';
import ImageArticle from './ImageArticle';
import Alert from './Alert';
import '../style/ArticleCard.css'
import { http } from '../config';

const ArticleCard = ({ article, onBuyClick }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [alert, setAlert] = useState({
    title: '',
    content: '',
    showAlert: false,
  });

  const handleBuyClick = async () => {
    try {
      const userId = sessionStorage.getItem('userId');
      
      // TODO arreglar dos articulos iguales
      //const isArticleAlreadyInCart = isArticleInCart(article._id);
      // if (isArticleAlreadyInCart) {
      //   return;
      // }
  
      const requestOptions = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          $push: {
            cart: {
              itemId: article._id,
              quantity: 1,
            }
          }
        }),
      };
  
      const response = await fetch(`${http}/users/${userId}`, requestOptions);
      const data = await response.json();
  
      if (response.ok) {
        setAlert({
          title: 'Articulo añadido',
          content: 'Articulo añadido correctamente a su cesta',
          showAlert: true,
        });
        setTimeout(() => {
          setAlert({
            showAlert: false,
          });
        }, 1000);
        setIsModalOpen(false);
        onBuyClick(article._id);
      } else {
        setAlert({
          title: 'INICIE SESIÓN',
          content: 'Por favor inicie sesión antes de seguir comprando',
          showAlert: true,
        });
        console.error('Error al agregar al carrito:', data.error);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };  

  const handleImageClick = () => {
    setIsModalOpen(true);
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const capitalizeFirstLetter = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  return (
    <div className="card">
      {alert.showAlert && (
        <Alert
          title={alert.title}
          content={alert.content}
          onClose={() => setAlert({ ...alert, showAlert: false })}
        />
      )}
      <h3>{capitalizeFirstLetter(article.type)}</h3>
      <img
        src={article.image}
        alt={article.type}
        className="article-image"
        id='foto'
        onClick={() => !isModalOpen && handleImageClick()}
      />
      <div className="details">
        <p><b>Material:</b> {capitalizeFirstLetter(article.material)}</p>
        <p><b>Acabado:</b> {capitalizeFirstLetter(article.finish)}</p>
        <p><b>Dimensiones:</b> {capitalizeFirstLetter(article.dimensions)}</p>
        <p><b>Detalles:</b> {capitalizeFirstLetter(article.details)}</p>
        <p><b>Precio:</b> {article.price}€</p>
      </div>
      <div className="button-container">
        <button onClick={handleBuyClick} id='Comprar'>Comprar</button>
      </div>
      {isModalOpen && (<ImageArticle
        type={article.type}
        imageUrl={article.image}
        material={article.material}
        finish={article.finish}
        dimensions={article.dimensions}
        details={article.details}
        price={article.price}
        id={article._id}
        onClose={handleCloseModal}
      />
      )}
    </div>
  );
};

export default ArticleCard;

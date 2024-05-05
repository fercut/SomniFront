import React, { useEffect, useState } from 'react';
import Alert from './Alert';
import '../style/ImageArticle.css';
import { http } from '../config';

const ImageArticle = ({ type, imageUrl, material, finish, dimensions, details, price, id, onClose }) => {
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };
  const [cartItems, setCartItems] = useState([]);
  const [alert, setAlert] = useState({
    title: '',
    content: '',
    showAlert: false,
  });

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const capitalizeFirstLetter = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  const isArticleInCart = (articleId) => {
    return cartItems.some((item) => item.itemId === articleId);
  };

  const handleBuyClick = async () => {
    try {
    
      const userId = sessionStorage.getItem('userId');

      if (!id) {
        console.error('El artículo no tiene un ID definido');
        return;
      }

      if (isArticleInCart(id)) {
        return;
      }

      const response = await fetch(`${http}/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          $push: {
            cart: {
              itemId: id,
              quantity: 1,
            }
          }
        }),

      });

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
        onBuyClick(id);
      } else {
        setAlert({
          title: 'INICIE SESIÓN',
          content: 'Por favor inicie sesión antes de seguir comprando',
          showAlert: true,
        });
        console.error('Error al agregar al carrito, usuario: ', data.error);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };


  return (
    <div className='modal'>
    <div className="image-article-modal">
      {alert.showAlert && (
        <Alert
          title={alert.title}
          content={alert.content}
          onClose={() => setAlert({ ...alert, showAlert: false })}
        />
      )}
      <div className="image-container">
        <img src={imageUrl} alt="Article"/>
        <div className='content'>
          <h1>{capitalizeFirstLetter(type)}</h1>
          <p><b>Material:</b> {capitalizeFirstLetter(material)}</p>
          <p><b>Acabado:</b> {capitalizeFirstLetter(finish)}</p>
          <p><b>Dimensiones:</b> {capitalizeFirstLetter(dimensions)}</p>
          <p><b>Detalles:</b> {capitalizeFirstLetter(details)}</p>
          <p><b>Precio:</b> {price}€</p>
          <button className='shop-button' onClick={handleBuyClick} >Comprar</button>
        </div>
        <button className="close-button" onClick={onClose}>&times;</button>
      </div>
    </div>
    </div>
  );
};

export default ImageArticle;

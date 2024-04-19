import React, { useState } from 'react';
import ImageArticle from './ImageArticle';
import Alert from './Alert';
import '../style/ArticleCard.css'

const ArticleCard = ({ article, onBuyClick }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [alert, setAlert] = useState({
    title: '',
    content: '',
    showAlert: false,
  });

  const isArticleInCart = (articleId) => {
    return cartItems.some((item) => item.itemId === articleId);
  };

  const handleBuyClick = async () => {
    try {
      const userId = sessionStorage.getItem('userId');

      if (!userId) {
        console.error('UserId no encontrado en sessionStorage');
        return;
      }

      if (!article._id) {
        console.error('El artículo no tiene un ID definido');
        return;
      }

      if (isArticleInCart(article._id)) {
        return;
      }

      const response = await fetch(`http://localhost:3000/users/${userId}`, {
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
        setIsModalOpen(false);
        onBuyClick(article._id);
      } else {
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
        src={`data:image/jpeg;base64,${article.image}`}
        alt={article.type}
        className="article-image"
        width={'200px'}
        onClick = {() => !isModalOpen && handleImageClick()}
      />
      <div className="details">
        <p><b>Material:</b> {capitalizeFirstLetter(article.material)}</p>
        <p><b>Acabado:</b> {capitalizeFirstLetter(article.finish)}</p>
        <p><b>Dimensiones:</b> {capitalizeFirstLetter(article.dimensions)}</p>
        <p><b>Detalles:</b> {capitalizeFirstLetter(article.details)}</p>
        <p><b>Precio:</b> {article.price}€</p>
      </div>
      <button onClick={handleBuyClick}>Comprar</button>
      {isModalOpen && (<ImageArticle
        type={article.type}
        imageUrl={`data:image/jpeg;base64,${article.image}`}
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

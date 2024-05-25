import React, { useState } from 'react';
import '../style/CartCard.css'

const CartCard = ({ cartItem, onIncrease, onDecrease, onDelete }) => {
  const { itemId, quantity, image, type, details, price } = cartItem;

  const handleIncreaseClick = () => {
    onIncrease(itemId);
  };

  const handleDecreaseClick = () => {
    onDecrease(itemId);
  };

  const handleDeleteClick = () => {
    onDelete(itemId);
  };

  const capitalizeFirstLetter = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  console.log(cartItem);

  return (
    <div className="cart-card">
      <img
        src={image}
        alt={type}
        className="cart-image"
        width={'100px'}
      />
      <div className="cart-details">
        <p><b>Artículo:</b> {capitalizeFirstLetter(type)}</p>
        <p><b>Detalle:</b> {details}</p>
        <p><b>Precio:</b> {price}€</p>
      </div>
      <div className="cart-buttons">
        <button onClick={handleDecreaseClick}> &#45; </button>
        <p className='quantity'>{quantity}</p>
        <button onClick={handleIncreaseClick}> &#43; </button>
        <button onClick={handleDeleteClick}>Eliminar</button>
      </div>
    </div>
  );
};

export default CartCard;

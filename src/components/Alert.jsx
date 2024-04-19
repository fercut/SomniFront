import React, { useEffect, useState } from 'react';
import '../style/Alert.css';

const Alert = ({ title, content, onClose }) => {

  const handleCloseAlert  = () => {
    onClose();
  };

  return (
    <div className='alert'>
        <h1>{title}</h1>        
        <p>{content}</p>
        <button onClick={handleCloseAlert}>X</button>
    </div>
  );
};

export default Alert;

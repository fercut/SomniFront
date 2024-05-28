import React, { useState } from 'react';
import Alert from './Alert.jsx';
import { http } from '../config';
import '../style/AddProduct.css';

const CrearJoyaForm = ({ onJoyaRegistro, onClose }) => {
  const token = sessionStorage.getItem('token');
  const [alert, setAlert] = useState({
    title: '',
    content: '',
    showAlert: false,
  });
  const [joyaData, setJoyaData] = useState({
    type: '',
    material: '',
    finish: '',
    dimensions: '',
    details: '',
    units: '',
    price: '',
    image: '',
    imagePath: '',
  });

  const [imageError, setImageError] = useState('');

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`${http}/articles/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        setAlert({
          title: 'Articulo creado',
          content: 'Nuevo articulo ingresado en la BBDD con exito',
          showAlert: true,
        });
        setJoyaData({
          type: '',
          material: '',
          finish: '',
          dimensions: '',
          details: '',
          units: '',
          price: '',
          image: '',
          imagePath: '',
        });
      } else {
        setAlert({
          title: 'Error',
          content: 'No se ha podido añadir un nuevo articulo',
          showAlert: true,
        });
      }
    } catch (error) {
      setAlert({
        title: 'Error',
        content: 'No se ha podido añadir un nuevo articulo',
        showAlert: true,
      });
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setJoyaData({ ...joyaData, [name]: value });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const filePath = event.target.value;

    if (validateImagePath(filePath)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setJoyaData({
          ...joyaData,
          image: e.target.result,  // Guarda la imagen en base64
          imagePath: filePath,
        });
        setImageError('');
      };
      reader.readAsDataURL(file);
    } else {
      setImageError('El archivo debe ser una imagen con extensión .jpg, .jpeg, .png o .webp.');
    }
  };

  const validateImagePath = (path) => {
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    return validExtensions.some(ext => path.toLowerCase().endsWith(ext));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (imageError) {
      alert(imageError);
      return;
    }
    onSubmit(joyaData);
  };

  return (
    <div className='addProduct'>
      <div className='modal-content'>
        <span className='close' onClick={onClose}>&times;</span>
        <h2>Nueva Joya</h2>
        <form onSubmit={handleSubmit}>
          <div className='field'>
            <label htmlFor="type">Tipo:</label>
            <select id="type" name="type" onChange={handleInputChange} value={joyaData.type} required>
              <option value="">Selecciona un tipo</option>
              <option value="anillo">Anillo</option>
              <option value="pendientes">Pendientes</option>
              <option value="pulsera">Pulseras</option>
              <option value="cadena">Cadenas</option>
              <option value="gargantilla">Gargantillas</option>
              <option value="colgante">Colgante</option>
            </select>
          </div>
          <div className='field'>
            <label htmlFor="material">Material:</label>
            <select id="material" name="material" onChange={handleInputChange} value={joyaData.material} required>
              <option value="">Selecciona un material</option>
              <option value="plata">Plata</option>
              <option value="oro">Oro</option>
              <option value="acero">Acero</option>
            </select>
          </div>
          <div className='field'>
            <label htmlFor="finish">Acabado:</label>
            <select id="finish" name="finish" onChange={handleInputChange} value={joyaData.finish} required>
              <option value="">Selecciona un acabado</option>
              <option value="plateado">Plateado</option>
              <option value="Baño de oro de 18kt.">Baño de oro de 18kt.</option>
              <option value="Baño de Oro Rosa de 18kt.">Baño de Oro Rosa de 18kt.</option>
              <option value="Baño de rodio">Baño de rodio</option>
            </select>
          </div>
          <div className='field'>
            <label htmlFor="dimensions">Dimensiones:</label>
            <input type="text" id="dimensions" name="dimensions" onChange={handleInputChange} value={joyaData.dimensions} required />
          </div>
          <div className='field'>
            <label htmlFor="details">Detalles:</label>
            <input type="text" id="details" name="details" onChange={handleInputChange} value={joyaData.details} required />
          </div>
          <div className='field'>
            <label htmlFor="units">Unidades:</label>
            <input type="number" id="units" name="units" onChange={handleInputChange} value={joyaData.units} required />
          </div>
          <div className='field'>
            <label htmlFor="price">Precio:</label>
            <input type="number" id="price" name="price" onChange={handleInputChange} value={joyaData.price} required />
          </div>
          <div className='field'>
            <label htmlFor="image">Imágenes:</label>
            <input type="file" id="image" name="image" onChange={handleImageChange} />
            <input type="text" value={joyaData.imagePath} readOnly />
            {imageError && <p className="error">{imageError}</p>}
          </div>
          <button type="submit">Registrar Joya</button>
        </form>
      </div>
      {alert.showAlert && (
          <Alert
            title={alert.title}
            content={alert.content}
            onClose={() => setAlert({ ...alert, showAlert: false })}
          />
        )}
    </div>
  );
};

export default CrearJoyaForm;

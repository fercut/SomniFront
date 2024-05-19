import React, { useState } from 'react';
import '../style/form.css';

const CrearJoyaForm = ({ onJoyaRegistro }) => {
  const [joyaData, setJoyaData] = useState({
    tipo: '',
    material: '',
    acabado: '',
    dimensiones: '',
    detalles: '',
    unidades: '',
    precio: '',
    imagenes: []
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setJoyaData({ ...joyaData, [name]: value });
  };

  const handleImagenesChange = (event) => {
    const files = event.target.files;
    const imagenesArray = [];

    // Leer cada archivo y convertirlo a base64
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = (e) => {
        imagenesArray.push(e.target.result);
      };
      reader.readAsDataURL(files[i]);
    }

    setJoyaData({ ...joyaData, imagenes: imagenesArray });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Llamamos a la función que se pasa como prop para registrar la joya
    onJoyaRegistro(joyaData);

    // Limpiamos los campos después de registrar la joya
    setJoyaData({
      tipo: '',
      material: '',
      acabado: '',
      dimensiones: '',
      detalles: '',
      unidades: '',
      precio: '',
      imagenes: []
    });
  };

  return (
    <div className='container'>
      <h2>Crear Nueva Joya</h2>
      <form onSubmit={handleSubmit}>
      <div className='field'>
          <label htmlFor="tipo">Tipo:</label>
          <input type="text" id="tipo" name="tipo" onChange={handleInputChange} value={joyaData.tipo} required />
        </div>
        <div className='field'>
          <label htmlFor="material">Material:</label>
          <input type="text" id="material" name="material" onChange={handleInputChange} value={joyaData.material} required />
        </div>
        <div className='field'>
          <label htmlFor="acabado">Acabado:</label>
          <input type="text" id="acabado" name="acabado" onChange={handleInputChange} value={joyaData.acabado} required />
        </div>
        <div className='field'>
          <label htmlFor="dimensiones">Dimensiones:</label>
          <input type="text" id="dimensiones" name="dimensiones" onChange={handleInputChange} value={joyaData.dimensiones} />
        </div>
        <div className='field'>
          <label htmlFor="detalles">Detalles:</label>
          <textarea id="detalles" name="detalles" onChange={handleInputChange} value={joyaData.detalles}></textarea>
        </div>
        <div className='field'>
          <label htmlFor="unidades">Unidades:</label>
          <input type="number" id="unidades" name="unidades" onChange={handleInputChange} value={joyaData.unidades} required />
        </div>
        <div className='field'>
          <label htmlFor="precio">Precio:</label>
          <input type="number" id="precio" name="precio" onChange={handleInputChange} value={joyaData.precio} required />
        </div>
        <div className='field'>
          <label htmlFor="imagenes">Imágenes:</label>
          <input type="file" id="imagenes" name="imagenes" onChange={handleImagenesChange} multiple />
        </div>
        <button type="submit">Registrar Joya</button>
      </form>
    </div>
  );
};

export default CrearJoyaForm;

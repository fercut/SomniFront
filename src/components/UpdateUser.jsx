import React, { useState } from 'react';
import '../style/UpdateUser.css';
import { http } from '../config'; // Asegúrate de que http esté correctamente configurado

const UpdateUser = ({ userData, onClose, onUpdate }) => {
  const [editedData, setEditedData] = useState(userData);
  const [error, setError] = useState(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedData({ ...editedData, [name]: value });
  };

  const handleSaveChanges = async () => {
    try {
      const userId = sessionStorage.getItem('userId');
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${http}/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editedData),
      });

      if (response.ok) {
        const data = await response.json();
        onUpdate(data); // Actualiza los datos del usuario en el componente padre
        onClose();
      } else {
        const errorData = await response.json();
        console.error('Error al actualizar los datos del usuario:', errorData.message);
        setError(errorData.message);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      setError('Error en la solicitud: ' + error.message);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Modificar Datos de Usuario</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className="input-group">
          <label htmlFor="name">Nombre:</label>
          <input type="text" id="name" name="name" value={editedData.name} onChange={handleInputChange} placeholder="Nombre" />
        </div>
        <div className="input-group">
          <label htmlFor="lastname">Apellido:</label>
          <input type="text" id="lastname" name="lastname" value={editedData.lastname} onChange={handleInputChange} placeholder="Apellido" />
        </div>
        <div className="input-group">
          <label htmlFor="email">Correo electrónico:</label>
          <input type="email" id="email" name="email" value={editedData.email} onChange={handleInputChange} placeholder="Correo electrónico" />
        </div>
        <div className="input-group">
          <label htmlFor="phone">Teléfono:</label>
          <input type="text" id="phone" name="phone" value={editedData.phone} onChange={handleInputChange} placeholder="Teléfono" />
        </div>
        <div className="input-group">
          <label htmlFor="adress">Dirección:</label>
          <input type="text" id="adress" name="adress" value={editedData.adress} onChange={handleInputChange} placeholder="Dirección" />
        </div>
        <div className="input-group">
          <label htmlFor="location">Localidad:</label>
          <input type="text" id="location" name="location" value={editedData.location} onChange={handleInputChange} placeholder="Localidad" />
        </div>
        <div className="input-group">
          <label htmlFor="city">Ciudad:</label>
          <input type="text" id="city" name="city" value={editedData.city} onChange={handleInputChange} placeholder="Ciudad" />
        </div>
        <div className="input-group">
          <label htmlFor="postalCode">Código postal:</label>
          <input type="text" id="postalCode" name="postalCode" value={editedData.postalCode} onChange={handleInputChange} placeholder="Código postal" />
        </div>
        <button onClick={handleSaveChanges} id='updateUser' className='updateUser'>Guardar cambios</button>
      </div>
    </div>
  );
};

export default UpdateUser;

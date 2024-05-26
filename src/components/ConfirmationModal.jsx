import React from 'react';
import Modal from 'react-modal';
import '../style/ConfirmationModal.css';

const ConfirmationModal = ({ isOpen, onRequestClose, onConfirm, title, message }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Confirmación de eliminación"
            className="modalConfirmation"
            overlayClassName="modal-overlay"
        >
            <button className="close-button" onClick={onRequestClose}>×</button>
            <h2>{title}</h2>
            <p>{message}</p>
            <div className="modal-actions">
                <button onClick={onConfirm}>Eliminar</button>
                <button onClick={onRequestClose}>Cancelar</button>
            </div>
        </Modal>
    );
};

export default ConfirmationModal;

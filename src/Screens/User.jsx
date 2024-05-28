import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/User.css';
import UpdateUser from '../components/UpdateUser';
import OrderDetail from '../components/OrderDetail';
import { http } from '../config';

const User = () => {
    const token = sessionStorage.getItem('token');
    const userId = sessionStorage.getItem('userId');
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showOrderDetail, setShowOrderDetail] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [userData, setUserData] = useState({
        name: '',
        lastname: '',
        email: '',
        phone: '',
        adress: '',
        location: '',
        city: '',
        postalCode: '',
        quantity: '',
    });
    const [error, setError] = useState(null);

    const handleEditClick = () => {
        setShowEditModal(true);
    };

    const handleCloseModal = () => {
        setShowEditModal(false);
    };

    const handleOrderDetailClick = (order) => {
        setSelectedOrder(order);
        setShowOrderDetail(true);
    };

    const handleCloseOrderDetail = () => {
        setShowOrderDetail(false);
    };

    useEffect(() => {
        const fetchUserData = async () => {
            if (!userId || !token) {
                return;
            }

            try {
                const response = await fetch(`${http}/users/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserData({
                        name: data.name,
                        lastname: data.lastname,
                        email: data.email,
                        phone: data.phone,
                        adress: data.adress,
                        location: data.location,
                        city: data.city,
                        postalCode: data.postalCode,
                        quantity: data.cart.quantity,
                    });
                } else {
                    const errorData = await response.json();
                    console.error('Error al obtener los datos del usuario:', errorData.message);
                    setError(errorData.message);
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
                setError(error.message);
            }
        };

        const fetchOrderHistory = async () => {
            try {
                const response = await fetch(`${http}/orders/order/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setOrders(data.orders);
                } else {
                    const errorData = await response.json();
                    console.error('Error al obtener el historial de pedidos:', errorData.message);
                    setError(errorData.message);
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
                setError(error.message);
            }
        };

        fetchUserData();
        fetchOrderHistory();
    }, [userId, token]);

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/home');
        window.location.reload();
    };

    const handleUpdateUserData = (updatedData) => {
        setUserData(updatedData);
    };

    return (
        <div className='user'>
            <h1>Bienvenido {userData.name}</h1>
            <div className='data'>
                <div className='usuario'>
                    <h3>Datos del Usuario</h3>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <p><b>Nombre:</b> {userData.name} {userData.lastname}</p>
                    <p><b>Email:</b> {userData.email}</p>
                    <p><b>Telefono:</b> {userData.phone}</p>
                    <p><b>Dirección:</b> {userData.adress}</p>
                    <p><b>Localidad:</b> {userData.location}</p>
                    <p><b>Ciudad:</b> {userData.city}</p>
                    <p><b>Codigo postal:</b> {userData.postalCode}</p>
                    <button id='Modificar' onClick={handleEditClick}>Modificar</button>
                    <button onClick={handleLogout}>Cerrar sesión</button>
                    {showEditModal && (
                        <UpdateUser
                            userData={userData}
                            onUpdate={handleUpdateUserData}
                            onClose={handleCloseModal}
                        />
                    )}
                </div>
                <div className='pedidos'>
                    <h3>Historial de pedidos</h3>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {orders.length > 0 ? (
                        <ul>
                            {orders.map((order) => (
                                <li key={order._id}>
                                    <div>
                                        <p><b>Fecha:</b> {new Date(order.date).toLocaleDateString()}</p>
                                        <p><b>Número de pedido: </b> ***{order._id.substring(order._id.length - 4)}</p>
                                        <p><b>Precio del pedido:</b> {order.price}€</p>
                                    </div>
                                    <button id={`Ver pedido ${order._id}`} onClick={() => handleOrderDetailClick(order)}>Ver</button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No hay historial de pedidos para mostrar.</p>
                    )}
                </div>
            </div>
            {showOrderDetail && (
                <OrderDetail order={selectedOrder} onClose={handleCloseOrderDetail} />
            )}
        </div>
    );
};

export default User;

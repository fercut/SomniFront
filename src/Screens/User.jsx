import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/User.css';
import UpdateUser from '../components/UpdateUser';
import OrderDetail from '../components/OrderDetail';

const User = () => {
    const token = sessionStorage.getItem('token');
    const userId = sessionStorage.getItem('userId');
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
    const handleEditClick = () => {
        setShowEditModal(true);
    };
    const handleSaveChanges = async (editedData) => {
        try {
            const response = await fetch(`${process.env.CONECTION}/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                },
                body: JSON.stringify(editedData),
            });

            if (response.ok) {
                onSave(editedData);
                onClose();
            } else {
                console.error('Error al actualizar los datos del usuario:', response.statusText);
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        }
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
                const responseRender = await fetch(`${process.env.CONECTION}/users/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (responseRender.ok) {
                    const data = await responseRender.json();
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
                    console.error('Error al obtener los datos del usuario:', data.message);
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
            }
        };

        const fetchOrderHistory = async () => {
            const userId = sessionStorage.getItem('userId');

            try {
                const response = await fetch(`${process.env.CONECTION}/orders/order/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();
                console.log(data);

                if (response.ok) {
                    setOrders(data.orders);
                } else {
                    console.error('Error al obtener el historial de pedidos:', data.message);
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
            }
        };

        fetchUserData();
        fetchOrderHistory();
    }, []);

    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/home');
        window.location.reload();
    };

    return (
        <div className='user'>
            <h1>Bienvenido {userData.name}</h1>
            <div className='data'>
                <div className='usuario'>
                    <h3>Datos del Usuario</h3>
                    <p><b>Nombre:</b> {userData.name} {userData.lastname}</p>
                    <p><b>Email:</b> {userData.email}</p>
                    <p><b>Telefono:</b> {userData.phone}</p>
                    <p><b>Dirección:</b> {userData.adress}</p>
                    <p><b>Localidad:</b> {userData.location}</p>
                    <p><b>Ciudad:</b> {userData.city}</p>
                    <p><b>Codigo postal:</b> {userData.postalCode}</p>
                    <button id='Modificar' onClick={handleEditClick}>Modificar</button>
                    {showEditModal && (
                        <UpdateUser
                            userData={userData}
                            onSave={handleSaveChanges}
                            onClose={handleCloseModal}
                        />
                    )}
                </div>
                <div className='pedidos'>
                    <h3>Historial de pedidos</h3>
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
            <button onClick={handleLogout}>Cerrar sesión</button>
            {showOrderDetail && (
                <OrderDetail order={selectedOrder} onClose={handleCloseOrderDetail} />
            )}
        </div>
    );
};

export default User;
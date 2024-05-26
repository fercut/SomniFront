import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { http } from '../config'; 
import AddProduct from '../components/AddProduct';
import UpdateProduct from '../components/UpdateProduct';
import ConfirmationModal from '../components/ConfirmationModal.jsx';
import '../style/Root.css';

Modal.setAppElement('#root');

const Root = () => {
    const [articles, setArticles] = useState([]);
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [showAddJewelry, setShowAddJewelry] = useState(false);
    const [showUpdateJewelry, setShowUpdateJewelry] = useState(false);
    const [currentArticle, setCurrentArticle] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalContent, setModalContent] = useState({});
    const [modalAction, setModalAction] = useState(null);
    const navigate = useNavigate();

    const fetchWithAuth = async (url, options = {}) => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }

        const headers = {
            ...options.headers,
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        };

        const response = await fetch(url, { ...options, headers });
        if (response.status === 401) {
            console.error('Token inválido o expirado');
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('isAdmin');
            window.location.href = '/login';
            return null;
        }

        return response;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const articlesResponse = await fetchWithAuth(`${http}/articles`);
                if (articlesResponse && articlesResponse.ok) {
                    const articlesData = await articlesResponse.json();
                    setArticles(articlesData);
                }

                const usersResponse = await fetchWithAuth(`${http}/users`);
                if (usersResponse && usersResponse.ok) {
                    const usersData = await usersResponse.json();
                    setUsers(usersData);
                }

                const ordersResponse = await fetchWithAuth(`${http}/orders`);
                if (ordersResponse && ordersResponse.ok) {
                    const ordersData = await ordersResponse.json();
                    const ordersWithUserEmails = await Promise.all(ordersData.map(async (order) => {
                        const userResponse = await fetchWithAuth(`${http}/users/${order.user}`);
                        if (userResponse && userResponse.ok) {
                            const userData = await userResponse.json();
                            return { ...order, userEmail: userData.email };
                        }
                        return { ...order, userEmail: 'Email no disponible' };
                    }));
                    setOrders(ordersWithUserEmails);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleSentChange = async (orderId, sent) => {
        try {
            const response = await fetchWithAuth(`${http}/orders/${orderId}`, {
                method: 'PATCH',
                body: JSON.stringify({ sent }),
            });

            if (response && response.ok) {
                setOrders(orders.map(order =>
                    order._id === orderId ? { ...order, sent } : order
                ));
            } else {
                console.error('Error updating order');
            }
        } catch (error) {
            console.error('Error in handleSentChange:', error);
        }
    };

    const handleDelete = async (id, type) => {
        const url = type === 'user' ? `${http}/users/${id}` : `${http}/articles/${id}`;
        try {
            const response = await fetchWithAuth(url, {
                method: 'DELETE'
            });
            if (response && response.ok) {
                if (type === 'user') {
                    setUsers(users.filter(user => user._id !== id));
                } else {
                    setArticles(articles.filter(article => article._id !== id));
                }
                closeModal();
            } else {
                console.error(`Error deleting ${type}`);
            }
        } catch (error) {
            console.error(`Error in handleDelete ${type}:`, error);
        }
    };    

    const openModal = (id, type) => {
        setModalContent({ id, type });
        setModalAction(() => () => handleDelete(id, type));
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setModalContent({});
        setModalAction(null);
    };

    const handleDeleteArticle = (articleId) => {
        openModal(articleId, 'article');
    };

    const handleDeleteUser = (userId) => {
        openModal(userId, 'user');
    };

    const handleAddJewelry = async (newJewelry) => {
        try {
            const response = await fetchWithAuth(`${http}/articles`, {
                method: 'POST',
                body: JSON.stringify(newJewelry),
            });
            if (response && response.ok) {
                const addedJewelry = await response.json();
                setArticles([...articles, addedJewelry]);
            } else {
                console.error('Error adding jewelry');
            }
        } catch (error) {
            console.error('Error in handleAddJewelry:', error);
        }
    };

    const handleEditArticle = (article) => {
        setCurrentArticle(article);
        setShowUpdateJewelry(true);
    };

    const handleUpdateJewelry = async (updatedJoya) => {
        setArticles(articles.map(article => (article._id === updatedJoya._id ? updatedJoya : article)));
        setShowUpdateJewelry(false);
        setCurrentArticle(null);
    };

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/home');
        window.location.reload();
    };

    return (
        <div className="root-container">
            <h1>Panel de administrador</h1>
            <button onClick={handleLogout}>Cerrar sesión</button>
            <div className="section">
                <h2>Órdenes</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Numero de pedido</th>
                            <th>Usuario</th>
                            <th>Total</th>
                            <th>Fecha</th>
                            <th>Artículos</th>
                            <th>Unidades</th>
                            <th>Enviado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id}>
                                <td>****{order._id.substring(order._id.length - 6)}</td>
                                <td>****{order.user.substring(order.user.length - 6)}</td>
                                <td>{order.price}€</td>
                                <td>{new Date(order.date).toLocaleDateString()}</td>
                                <td>
                                    {order.article.map((art, index) => (
                                        <div key={index}>****{art.articleId.substring(art.articleId.length - 6)}</div>
                                    ))}
                                </td>
                                <td>
                                    {order.article.map((art, index) => (
                                        <div key={index}>{art.quantity}</div>
                                    ))}
                                </td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={order.sent}
                                        onChange={(e) => handleSentChange(order._id, e.target.checked)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="section">
                <h2>Usuarios</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>ID</th>
                            <th>Email</th>
                            <th>Teléfono</th>
                            <th>Ciudad</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>{user.name} {user.lastname}</td>
                                <td>****{user._id.substring(user._id.length - 6)}</td>
                                <td>{user.email}</td>
                                <td>{user.phone}</td>
                                <td>{user.city}</td>
                                <td>
                                    <button onClick={() => handleDeleteUser(user._id)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="sectionArticle">
                <header className='headerArticle'>
                    <h2>Artículos</h2>
                    <button onClick={() => setShowAddJewelry(true)}>Añadir Joya</button>
                </header>
                <table>
                    <thead>
                        <tr>
                            <th>Imagen</th>
                            <th>Tipo</th>
                            <th>Material</th>
                            <th>Acabado</th>
                            <th>Dimenciones</th>
                            <th>Descripción</th>
                            <th>Stock</th>
                            <th>Precio</th>
                            <th colSpan={2}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {articles.map(article => (
                            <tr key={article._id}>
                                <td><img
                                    src={article.image}
                                    alt={article.type}
                                    className="article-image"
                                    id='foto'
                                    width={75}
                                /></td>
                                <td>{article.type}</td>
                                <td>{article.material}</td>
                                <td>{article.finish}</td>
                                <td>{article.dimensions}</td>
                                <td>{article.details}</td>
                                <td style={article.units <= 15 ? { color: 'red', fontWeight: 'bold' } : {}}>{article.units}/unds</td>
                                <td>{article.price}€</td>
                                <td>
                                <button onClick={() => handleEditArticle(article)}>Editar</button>
                                </td>
                                <td>
                                    <button onClick={() => handleDeleteArticle(article._id)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {showAddJewelry && <AddProduct onAdd={handleAddJewelry} onClose={() => setShowAddJewelry(false)} />}
            {showUpdateJewelry && (
                <UpdateProduct
                    initialData={currentArticle}
                    onClose={() => setShowUpdateJewelry(false)}
                    onUpdate={handleUpdateJewelry}
                />
            )}
            <ConfirmationModal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                onConfirm={modalAction}
                title="¿Estás seguro?"
                message="Esta acción no se puede deshacer."
            />
        </div>
    );
};

export default Root;

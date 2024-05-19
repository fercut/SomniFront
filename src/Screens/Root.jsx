import React, { useState, useEffect } from 'react';
import { http } from '../config';
import AddProduct from '../components/AddProduct.jsx';
import '../style/Root.css';

const Root = () => {
    const [articles, setArticles] = useState([]);
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [showAddJewelry, setShowAddJewelry] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const articlesResponse = await fetch(`${http}/articles`);
                const usersResponse = await fetch(`${http}/users`);
                const ordersResponse = await fetch(`${http}/orders`);

                setArticles(await articlesResponse.json());
                setUsers(await usersResponse.json());
                setOrders(await ordersResponse.json());
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleAddJewelry = async (newJewelry) => {
        try {
            const response = await fetch(`${http}/articles`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newJewelry)
            });

            if (response.ok) {
                const addedJewelry = await response.json();
                setArticles([...articles, addedJewelry]);
                setShowAddJewelry(false);
            } else {
                console.error('Error adding jewelry:', response.statusText);
            }
        } catch (error) {
            console.error('Error adding jewelry:', error);
        }
    };

    const handleDeleteArticle = async (id) => {
        try {
            const response = await fetch(`${http}/articles/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setArticles(articles.filter(article => article._id !== id));
            } else {
                console.error('Error deleting article:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting article:', error);
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            const response = await fetch(`${http}/users/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setUsers(users.filter(user => user._id !== id));
            } else {
                console.error('Error deleting user:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <div className="root-container">
            <div className="section">
                <h2>Artículos</h2>
                <button onClick={() => setShowAddJewelry(true)}>Añadir Joya</button>
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Precio</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {articles.map(article => (
                            <tr key={article._id}>
                                <td>{article.name}</td>
                                <td>{article.description}</td>
                                <td>{article.price}€</td>
                                <td>
                                    <button onClick={() => handleDeleteArticle(article._id)}>Eliminar</button>
                                    <button>Editar</button>
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
                            <th>Email</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <button onClick={() => handleDeleteUser(user._id)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="section">
                <h2>Órdenes</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Usuario</th>
                            <th>Total</th>
                            <th>Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.user}</td>
                                <td>{order.price}€</td>
                                <td>{new Date(order.date).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {showAddJewelry && <AddProduct onAdd={handleAddJewelry} onClose={() => setShowAddJewelry(false)} />}
        </div>
    );
};

export default Root;

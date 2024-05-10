import React, { useState, useEffect } from 'react';
import { http } from '../config';


const OrderDetail = ({ order, onClose }) => {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        const fetchArticleDetails = async () => {
            try {
                if (!order || !order.article || order.article.length === 0) {
                    console.error('La orden o el campo article es nulo o está vacío');
                    return;
                }
                
                // Extraer los ObjectId de los artículos de la orden
                const articleIds = order.article.map(article => article.$oid);
    
                const articleDetails = await Promise.all(articleIds.map(async articleId => {
                    const response = await fetch(`${http}/articles/get/${articleId}`);
                    if (response.ok) {
                        const articleDetail = await response.json();
                        return articleDetail;
                    } else {
                        throw new Error('Error al obtener los detalles del artículo');
                    }
                }));
                setArticles(articleDetails);
            } catch (error) {
                console.error('Error al obtener los detalles de los artículos:', error);
            }
        };
    
        fetchArticleDetails();
    }, [order]);
    

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Detalles del pedido</h2>
                <span className="close" onClick={onClose}>&times;</span>
                <h3>Artículos del pedido</h3>
                <div className="articles">
                    {articles.map(article => (
                        <div key={article._id} className="article-card">
                        <div className="article-image">
                            <img src={`data:image/jpeg;base64,${article.image}`} width={'100'} alt="Imagen del artículo" />
                        </div>
                        <div className='article-details'>
                            <p><b>Nombre: </b>{article.details}</p>
                            <p><b>Unidades: </b>{}</p>
                            <p><b>Precio:</b> {article.price}€</p>
                        </div>
                    </div>
                    ))}
                </div>
                <hr />
                <p><b>Fecha:</b> {new Date(order.date).toLocaleDateString()}</p>
                <p><b>Número de pedido:</b> {order._id}</p>
                <p><b>Precio total:</b> {order.price}€</p>
            </div>
        </div>
    );
};

export default OrderDetail;
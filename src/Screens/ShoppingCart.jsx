import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CartCard from '../components/CartCard';
import Alert from '../components/Alert';
import '../style/ShoppingCart.css';
import tarjeta from '../../imagenes/visa.png';
import paquete from '../../imagenes/paquete.png';

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const userId = sessionStorage.getItem('userId');
  const token = sessionStorage.getItem('token');
  const [totalPrice, setTotalPrice] = useState(0);
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
  const [alert, setAlert] = useState({
    title: '',
    content: '',
    showAlert: false,
  });

  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    const calculateTotalPrice = () => {
      let total = 0;
      cartItems.forEach((item) => {
        total += item.price * item.quantity;
      });
      setTotalPrice(total);
    };

    calculateTotalPrice();
  }, [cartItems]);


  useEffect(() => {
    const fetchCart = async () => {

      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const responseLocal = await fetch('http://localhost:3000/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await responseLocal.json();
        if (responseLocal.ok && data) {
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
          const cartWithDetails = await Promise.all(
            data.cart.map(async (item) => {
              const articleDetails = await fetchArticleDetails(item.itemId);
              return { ...item, ...articleDetails, };
            })
          );
          setCartItems(cartWithDetails);
        } else {
          const responseRender = await fetch('https://somniapi.onrender.com/users/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await responseRender.json();

          if (responseRender.ok && data) {
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
            const cartWithDetails = await Promise.all(
              data.cart.map(async (item) => {
                const articleDetails = await fetchArticleDetails(item.itemId);
                return { ...item, ...articleDetails, };
              })
            );
            setCartItems(cartWithDetails);
          } else {
            console.error('Error al obtener el carrito:', data.message);
          }
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    };

    const fetchArticleDetails = async (articleId) => {
      try {
        const response = await fetch(`http://localhost:3000/articles/get/${articleId}`);
        const data = await response.json();

        if (response.ok) {
          return { type: data.type, image: data.image, details: data.details, price: data.price };
        } else {
          const fallbackResponse = await fetch(`https://somniapi.onrender.com/articles/get/${articleId}`);
          const fallbackData = await fallbackResponse.json();
          if (fallbackResponse.ok) {
            return { type: fallbackData.type, image: fallbackData.image, details: fallbackData.details, price: fallbackData.price };
          } else {
            console.error('Error al obtener detalles del artículo desde somniapi.onrender.com:', fallbackData.message);
            return {};
          }
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
        return {};
      }
    };


    fetchCart();
  }, [navigate]);

  const handleIncrease = async (itemId) => {
    try {
      const response = await fetch(`http://localhost:3000/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ itemId, action: 'increase' }),
      });

      const data = await response.json();

      if (response.ok) {
        setCartItems((prevCart) =>
          prevCart.map((item) =>
            item.itemId === itemId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      } else {
        const fallbackResponse = await fetch(`https://somniapi.onrender.com/users/${userId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ itemId, action: 'increase' }),
        });

        const fallbackData = await fallbackResponse.json();

        if (fallbackResponse.ok) {
          setCartItems((prevCart) =>
            prevCart.map((item) =>
              item.itemId === itemId
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          );
        } else {
          console.error('Error al aumentar la cantidad desde somniapi.onrender.com:', fallbackData.message);
        }
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };


  const handleDecrease = async (itemId) => {
    try {
      const response = await fetch(`http://localhost:3000/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ itemId, action: 'decrease' }),
      });

      const data = await response.json();

      if (response.ok) {
        setCartItems((prevCart) =>
          prevCart.map((item) =>
            item.itemId === itemId
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
        );
      } else {
        const fallbackResponse = await fetch(`https://somniapi.onrender.com/users/${userId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ itemId, action: 'decrease' }),
        });

        const fallbackData = await fallbackResponse.json();

        if (fallbackResponse.ok) {
          setCartItems((prevCart) =>
            prevCart.map((item) =>
              item.itemId === itemId
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
          );
        } else {
          console.error('Error al disminuir la cantidad desde somniapi.onrender.com:', fallbackData.message);
        }
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };


  const handleDelete = async (itemId) => {
    try {
      const response = await fetch(`http://localhost:3000/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ itemId, action: 'delete' }),
      });

      const data = await response.json();

      if (response.ok) {
        setCartItems((prevCart) => prevCart.filter((item) => item.itemId !== itemId));
      } else {
        console.error('Error al eliminar el artículo desde localhost:', data.message);
        const fallbackResponse = await fetch(`https://somniapi.onrender.com/users/${userId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ itemId, action: 'delete' }),
        });

        const fallbackData = await fallbackResponse.json();

        if (fallbackResponse.ok) {
          setCartItems((prevCart) => prevCart.filter((item) => item.itemId !== itemId));
        } else {
          console.error('Error al eliminar el artículo desde somniapi.onrender.com:', fallbackData.message);
        }
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };


  const handleOptionChange = (option) => {
    if (selectedOption === option) {
      setSelectedOption(null);
    } else {
      setSelectedOption(option);
    }
  };

  const handleOrder = async () => {
    try {
      if (selectedOption === null) {
        setAlert({
          title: 'Importante',
          content: 'Por favor indique un método de pago',
          showAlert: true,
        });
        return;
      }
  
      const response = await fetch('http://localhost:3000/orders/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user: userId,
          article: cartItems.map((item) => item.itemId),
          price: totalPrice,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        handleDelete(cartItems.map((item) => item.itemId));
        setAlert({
          title: 'Pedido realizado',
          content: '¡Gracias por tu compra!',
          showAlert: true,
        });
        setTimeout(() => {
          navigate('/home');
        }, 3000);
      } else {
        setAlert({
          title: 'Error',
          content: 'Error al realizar el pedido. Por favor, inténtalo de nuevo.',
          showAlert: true,
        });
        console.error('Error al crear la orden desde localhost:', data.message);
        // Intentar crear la orden desde somniapi.onrender.com si la solicitud a localhost falla
        const fallbackResponse = await fetch('https://somniapi.onrender.com/orders/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user: userId,
            article: cartItems.map((item) => item.itemId),
            price: totalPrice,
          }),
        });
  
        const fallbackData = await fallbackResponse.json();
  
        if (!fallbackResponse.ok) {
          setAlert({
            title: 'Error',
            content: 'Error al realizar el pedido. Por favor, inténtalo de nuevo.',
            showAlert: true,
          });
          console.error('Error al crear la orden desde somniapi.onrender.com:', fallbackData.message);
        }
      }
    } catch (error) {
      setAlert({
        title: 'Error',
        content: 'Error al realizar el pedido. Por favor, inténtalo de nuevo.',
        showAlert: true,
      });
      console.error('Error en la solicitud:', error);
    }
  };
  

  return (
    <div className='shopping-cart'>
      {alert.showAlert && (
        <Alert
          title={alert.title}
          content={alert.content}
          onClose={() => setAlert({ ...alert, showAlert: false })}
        />
      )}
      {cartItems.length > 0 ? (
        <div className='cart-container'>
          {cartItems.map((item, index) => (
            <CartCard
              key={index}
              cartItem={item}
              onIncrease={() => handleIncrease(item.itemId)}
              onDecrease={() => handleDecrease(item.itemId)}
              onDelete={() => handleDelete(item.itemId)}
            />
          ))}
        </div>
      ) : (
        <p>No hay artículos en el carrito en este momento.</p>
      )}

      {cartItems.length > 0 && (
        <div className='userData'>
          <h1>Precio total del pedido: {totalPrice}€</h1>
          <h3>Datos de envío:</h3>
          <p><b>Nombre:</b> {userData.name} {userData.lastname}</p>
          <p><b>Teléfono:</b> {userData.phone}</p>
          <p><b>Dirección:</b> {userData.adress}</p>
          <p><b>Localidad / Ciudad:</b> {userData.location} / {userData.city}</p>
          <p><b>Código postal:</b> {userData.postalCode}</p>
          <h3>Metodo de pago:</h3>
          <label className={selectedOption === 'Tarjeta' ? 'selected' : ''}>
            <input
              type="radio"
              name="paymentMethod"
              value="Tarjeta"
              onChange={() => handleOptionChange('Tarjeta')}
            />
            Tarjeta
            <img src={tarjeta} width={30} alt="tarjeta" />
          </label>

          <label className={selectedOption === 'Contrarreembolso' ? 'selected' : ''}>
            <input
              type="radio"
              name="paymentMethod"
              value="Contrarreembolso"
              onChange={() => handleOptionChange('Contrarreembolso')}
            />
            Contrarreembolso
            <img src={paquete} width={30} alt="paquete" />
          </label>
          <button onClick={handleOrder}>Tramitar pedido</button>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;

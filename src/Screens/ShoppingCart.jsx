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
  
        const localData = await responseLocal.json();
  
        if (responseLocal.ok && localData) {
          setUserData({
            name: localData.name,
            lastname: localData.lastname,
            email: localData.email,
            phone: localData.phone,
            adress: localData.adress,
            location: localData.location,
            city: localData.city,
            postalCode: localData.postalCode,
            quantity: localData.cart.quantity,
          });
  
          const cartWithDetailsLocal = await Promise.all(
            localData.cart.map(async (item) => {
              const articleDetails = await fetchArticleDetails(item.itemId);
              return { ...item, ...articleDetails };
            })
          );
  
          setCartItems(cartWithDetailsLocal);
        } else {
          console.error('Error al obtener el carrito desde localhost:', localData.message);
          // Intentar obtener el carrito desde somniapi.onrender.com si la solicitud a localhost falla
          throw new Error('Error al obtener el carrito desde localhost');
        }
      } catch (error) {
        console.error('Error en la solicitud a localhost:', error);
        // Intentar obtener el carrito desde somniapi.onrender.com si la solicitud a localhost falla
        try {
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
                return { ...item, ...articleDetails };
              })
            );
  
            setCartItems(cartWithDetails);
          } else {
            console.error('Error al obtener el carrito desde somniapi.onrender.com:', data.message);
          }
        } catch (error) {
          console.error('Error en la solicitud a somniapi.onrender.com:', error);
        }
      }
    };
  
    fetchCart();
  }, [token, navigate]);
  

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
        // Actualizar el estado con los artículos del carrito después de aumentar la cantidad
        setCartItems((prevCart) =>
          prevCart.map((item) =>
            item.itemId === itemId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      } else {
        // Intentar nuevamente la solicitud a somniapi.onrender.com en caso de error
        try {
          const renderResponse = await fetch(`https://somniapi.onrender.com/users/${userId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ itemId, action: 'increase' }),
          });
  
          const renderData = await renderResponse.json();
  
          if (renderResponse.ok) {
            // Actualizar el estado con los artículos del carrito después de aumentar la cantidad
            setCartItems((prevCart) =>
              prevCart.map((item) =>
                item.itemId === itemId
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              )
            );
          } else {
            console.error('Error al aumentar la cantidad en somniapi.onrender.com:', renderData.message);
          }
        } catch (error) {
          console.error('Error en la solicitud a somniapi.onrender.com:', error);
        }
      }
    } catch (error) {
      console.error('Error en la solicitud a localhost:', error);
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
        // Intentar nuevamente la solicitud a somniapi.onrender.com en caso de error
        try {
          const renderResponse = await fetch(`https://somniapi.onrender.com/users/${userId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ itemId, action: 'decrease' }),
          });
  
          const renderData = await renderResponse.json();
  
          if (renderResponse.ok) {
            setCartItems((prevCart) =>
              prevCart.map((item) =>
                item.itemId === itemId
                  ? { ...item, quantity: item.quantity - 1 }
                  : item
              )
            );
          } else {
            console.error('Error al disminuir la cantidad en somniapi.onrender.com:', renderData.message);
          }
        } catch (error) {
          console.error('Error en la solicitud a somniapi.onrender.com:', error);
        }
      }
    } catch (error) {
      console.error('Error en la solicitud a localhost:', error);
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
        // Intentar nuevamente la solicitud a somniapi.onrender.com en caso de error
        try {
          const renderResponse = await fetch(`https://somniapi.onrender.com/users/${userId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ itemId, action: 'delete' }),
          });
  
          const renderData = await renderResponse.json();
  
          if (renderResponse.ok) {
            setCartItems((prevCart) => prevCart.filter((item) => item.itemId !== itemId));
          } else {
            console.error('Error al eliminar el artículo en somniapi.onrender.com:', renderData.message);
          }
        } catch (error) {
          console.error('Error en la solicitud a somniapi.onrender.com:', error);
        }
      }
    } catch (error) {
      console.error('Error en la solicitud a localhost:', error);
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
        content: 'Por favor indique un metodo de pago',
        showAlert: true,
      });
      return;
    }

    const responseLocal = await fetch('http://localhost:3000/orders/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user: userId,
        article: cartItems.map(item => item.itemId),
        price: totalPrice,
      }),
    });

    const dataLocal = await responseLocal.json();

    if (responseLocal.ok) {
      handleDelete(cartItems.map(item => item.itemId));
      setAlert({
        title: 'Pedido realizado',
        content: '¡Gracias por tu compra!',
        showAlert: true,
      });
      setTimeout(() => {
        navigate('/home');
      }, 3000);
    } else {
      // Intentar con la segunda URL si la primera solicitud falla
      const responseRender = await fetch('https://somniapi.onrender.com/orders/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user: userId,
          article: cartItems.map(item => item.itemId),
          price: totalPrice,
        }),
      });

      const dataRender = await responseRender.json();

      if (responseRender.ok) {
        handleDelete(cartItems.map(item => item.itemId));
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

        console.error('Error al crear la orden:', dataRender.message);
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
}

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

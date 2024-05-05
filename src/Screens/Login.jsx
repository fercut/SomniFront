import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Alert from '../components/Alert';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [alert, setAlert] = useState({
    title: '',
    content: '',
    showAlert: false,
  });

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      // Si la tecla presionada es "Enter", realiza el inicio de sesión
      handleLogin();
    }
  };

  const handleLogin = async () => {
    if (email === '' || password === '') {
      setAlert({
        title: 'Error',
        content: 'Por favor rellene correctamente los campos',
        showAlert: true,
      });
      return;
    }

    try {
      const responseRender = await fetch(`${process.env.CONECTION}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (responseRender.ok) {
        const data = await responseRender.json();
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('userId', data.userId);
        setLoggedIn(true);
        onLogin(data.token);
      } else {
        setAlert({
          title: 'Error',
          content: 'Correo electronico o contraseña incorrecta',
          showAlert: true,
        });
        return;
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  if (loggedIn) {
    // Redirigir a la ruta "/home" si el usuario está autenticado
    return <Navigate to="/home" />;
  }

  return (
    <div className='login'>
      <h2>Iniciar sesión</h2>
      <input
        type="email"
        placeholder="Correo electrónico"
        style={{ fontWeight: 'bold' }}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <input
        type="password"
        placeholder="Contraseña"
        style={{ fontWeight: 'bold' }}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button onClick={handleLogin}>Iniciar sesión</button>
      <button onClick={() => navigate('/signin')}>Registrate</button>
      {alert.showAlert && (
        <Alert
          title={alert.title}
          content={alert.content}
          onClose={() => setAlert({ ...alert, showAlert: false })}
        />
      )}
    </div>
  );
};

export default Login;

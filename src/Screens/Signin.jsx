import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Alert from '../components/Alert';
import '../style/form.css';
import { http } from '../config';

const Signin = ({ onRegistro }) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const [registroExitoso, setRegistroExitoso] = useState(false);
  const [alert, setAlert] = useState({
    title: '',
    content: '',
    showAlert: false,
  });
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const responseRender = await fetch(`${http}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (responseRender.ok) {
        setAlert({
          title: 'Usuario registrado',
          content: 'Ya puede iniciar sesión',
          showAlert: true,
        });
        setRegistroExitoso(true);
        reset();
      } else {
        setAlert({
          title: 'Error al registrarse',
          content: 'Por favor intentelo de nuevo mas tarde',
          showAlert: true,
        });
      }
    } catch (error) {
      setAlert({
        title: 'Error al registrarse',
        content: 'Por favor intentelo de nuevo mas tarde',
        showAlert: true,
      });
    }
  };

  useEffect(() => {
    if (registroExitoso) {
      const timer = setTimeout(() => {
        navigate('/login');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [registroExitoso, navigate]);

  return (
    <div className="container">
      <h2>Regístrate</h2>
      {registroExitoso && <p>Registro exitoso. Puedes iniciar sesión ahora.</p>}
      <form onSubmit={handleSubmit(onSubmit)}>

        <input type="text" placeholder='Nombre' style={{ fontWeight: 'bold' }} {...register('name', { required: 'Este campo es requerido' })} />
        {errors.name && <span>{errors.name.message}</span>}

        <input type="text" placeholder='Apellidos' style={{ fontWeight: 'bold' }} {...register('lastname', { required: 'Este campo es requerido' })} />
        {errors.lastname && <span>{errors.lastname.message}</span>}

        <input
          type="text"
          placeholder='Correo electrónico'
          style={{ fontWeight: 'bold' }}
          {...register('email', {
            required: 'Este campo es requerido',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
              message: 'Introduce un correo electrónico válido',
            },
          })}
        />
        {errors.email && <span>{errors.email.message}</span>}

        <input
          type="text"
          placeholder='Verifique su correo'
          style={{ fontWeight: 'bold' }}
          {...register('verifyEmail', {
            required: 'Este campo es requerido',
            validate: (value) => value === watch('email') || 'Los correos electrónicos no coinciden',
          })}
        />
        {errors.verifyEmail && <span>{errors.verifyEmail.message}</span>}

        <input
          type="tel"
          placeholder='Telefono'
          style={{ fontWeight: 'bold' }}
          {...register('phone', {
            required: 'Este campo es requerido',
            pattern: {
              value: /^\d{9}$/,
              message: 'Introduce un número de teléfono válido',
            },
          })}
        />
        {errors.phone && <span>{errors.phone.message}</span>}

        <input type="text" placeholder='Dirección' style={{ fontWeight: 'bold' }} {...register('adress', { required: 'Este campo es requerido' })} />
        {errors.adress && <span>{errors.adress.message}</span>}

        <input type="text" placeholder='Localidad' style={{ fontWeight: 'bold' }} {...register('location', { required: 'Este campo es requerido' })} />
        {errors.location && <span>{errors.location.message}</span>}

        <input type="text" placeholder='Ciudad' style={{ fontWeight: 'bold' }} {...register('city', { required: 'Este campo es requerido' })} />
        {errors.city && <span>{errors.city.message}</span>}

        <input
          type="text"
          placeholder='Código Postal'
          style={{ fontWeight: 'bold' }}
          {...register('postalCode', {
            required: 'Este campo es requerido',
            pattern: {
              value: /^\d{5}$/,
              message: 'Introduce un código postal válido',
            },
          })}
        />
        {errors.postalCode && <span>{errors.postalCode.message}</span>}

        <input type="password" placeholder='Contraseña' style={{ fontWeight: 'bold' }} {...register('password', { required: 'Este campo es requerido' })} />
        {errors.password && <span>{errors.password.message}</span>}

        <input
          type="password"
          placeholder='Verificar Contraseña'
          style={{ fontWeight: 'bold' }}
          {...register('verifyPassword', {
            required: 'Este campo es requerido',
            validate: (value) => value === watch('password') || 'Las contraseñas no coinciden',
          })}
        />
        {errors.verifyPassword && <span>{errors.verifyPassword.message}</span>}

        <button type="submit">Registrar</button>
        {alert.showAlert && (
          <Alert
            title={alert.title}
            content={alert.content}
            onClose={() => setAlert({ ...alert, showAlert: false })}
          />
        )}
      </form>
    </div>
  );
};

export default Signin;

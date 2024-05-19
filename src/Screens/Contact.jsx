import React, { useState } from 'react';
import taller from '../assets/taller.gif';
import Alert from '../components/Alert';
import '../style/Contact.css';
import { http } from '../config';

const Contact = () => {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [alert, setAlert] = useState({
    title: '',
    content: '',
    showAlert: false,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const response = await fetch(`${http}/send-email-company`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, subject, message }),
      });
  
      if (response.ok) {
        setAlert({
          title: 'Correo enviado',
          content: 'Gracias por contactar con SomniJoyas, en breve le responderemos.',
          showAlert: true,
        });
        console.log('Correo enviado exitosamente');
        setEmail('');
        setSubject('');
        setMessage('');
      } else {
        setAlert({
          title: 'Error al enviar el correo',
          content: 'Por favor intentelo de nuevo mas tarde.',
          showAlert: true,
        });
        const errorData = await response.json();
        console.error('Error al enviar el correo:', errorData.error);
      }
    } catch (error) {
      setAlert({
        title: 'Error al enviar el correo',
        content: 'Por favor intentelo de nuevo mas tarde.',
        showAlert: true,
      });
      console.error('Error al enviar el correo:', error);
    }
  };

  return (
    <div className='company'>
      <div className='aboutUs'>
      {alert.showAlert && (
        <Alert
          title={alert.title}
          content={alert.content}
          onClose={() => setAlert({ ...alert, showAlert: false })}
        />
      )}
        <h2>Sobre nosotros</h2>
        <div className='us'>
          <article>
            <p>Desde que nació SomniJoyas teníamos muy claros nuestros valores, queríamos ofrecerte la mejor calidad,
              al mejor precio posible y además contribuir entre todas a la riqueza del país. Por eso para nosotras es
              muy importante trabajar con empresas españolas.
              Así que empezamos por escoger con mucho mimo y cuidado a todos y cada uno de nuestros proveedores.</p>
            <p>La verdad es que no fue difícil, porque en España tenemos la suerte de contar con joyeros excelentes que
              llevan generaciones trabajando en el oficio. Ellos nos ofrecen los mejores materiales y cuidan cada detalle
              para que tu joya sea perfecta.</p>
          </article>
          <figure>
            <img src={taller} alt="taller" />
          </figure>
        </div>
      </div>
      <div className='ourCommitment'>
        <h2>Comprometidos</h2>
        <p>
          Seleccionamos metales de alta calidad tanto para realizar nuestras piezas como para bañarlas. Apostamos por
          la Plata de Ley bañada en Rodio (considerado el metal precioso más caro del mundo), Oro y Oro Rosa, ambos de 18k.
          Y para poder ofreceros todo esto, no solo trabajamos con los mejores proveedores de España, que cuidan con mimo
          cada detalle, sino que todas nuestras Joyas pasan por exhaustivos controles de calidad.
        </p>
        <p>
          Y si tu Joya no te enamora tienes 30 días para devolverla totalmente gratis. Mandaremos un mensajero a recogerla
          y te devolveremos el dinero.
          Nuestro equipo de Atención al Cliente te asesorará sobre nuestras Joyas siempre que lo necesites.
        </p>
        <p>
          Pídenos consejo a través de <a href="mailto:somnijoyas@gmail.com">somnijoyas@gmail.com</a>, en nuestras
          redes sociales o desde el siguiente formulario ¡estamos deseando ayudarte!
        </p>
      </div>
      <div className='contactUs'>
        <h2>Contactanos</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-columns">
            <div className="left-column">
              <label htmlFor="email">Correo electrónico:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor="subject">Asunto:</label>
              <input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>
            <div className="right-column">
              <label htmlFor="message">Mensaje:</label>
              <textarea
                id="message"
                rows="4"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit">Enviar</button>
        </form>
      </div>
    </div>
  );
}

export default Contact;

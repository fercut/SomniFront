import React, {useState} from 'react'

const Contact = () => {
  const [clienteData, setClienteData] = useState({
    asunto: '',
    
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setClienteData({ ...clienteData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Llamamos a la función que se pasa como prop para registrar al cliente
    onRegistro(clienteData);

    // Limpiamos los campos después de registrar al cliente
    setClienteData({
      asunto: '',
    
    });
  };
  return (
    <div className='container'>

      <h2>Contacta con nosotros</h2>

      <form onSubmit={handleSubmit}>


      <button type="submit">Enviar</button>
      </form>

    </div>
  )
}

export default Contact;

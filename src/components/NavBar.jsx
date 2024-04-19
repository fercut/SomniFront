import React from 'react';
import { Link } from 'react-router-dom';
import '../style/NavBar.css';

const links = [
  {
    name: "Anillos",
    href: "/rings",
    icon: "../../imagenes/iconos/ring.png",
  },
  {
    name: "Pulseras",
    href: "/bracelets",
    icon: "../../imagenes/iconos/bracelets.png",
  },
  {
    name: "Gargantillas",
    href: "/chokers",
    icon: "../../imagenes/iconos/chokers.png",
  },
  {
    name: "Pendientes",
    href: "/earrings",
    icon: "../../imagenes/iconos/earrings.png",
  },
  {
    name: "Cadenas",
    href: "/chains",
    icon: "../../imagenes/iconos/chains.png",
  },
  {
    name: "Colgantes",
    href: "/pendants",
    icon: "../../imagenes/iconos/pendants.png",
  },
];
const home = [{
  name: "Home",
  href: "/home"
}];

const shop = [
  {
    name: "",
    href: "/login",
    icon: "../../imagenes/iconos/login.png"
  },
  {
    name: "",
    href: "/shoppingCart",
    icon: "../../imagenes/iconos/carrito.png"
  },
  {
    name: "",
    href: "/contact",
    icon: "../../imagenes/iconos/contacto.png"
  },
]

const NavBar = () => {
  return (
    <nav>
        <div className='home'>
          {home.map((link, index) => (
            <Link key={index} to={link.href}>
              <img src="../../imagenes/iconos/home.png" alt="home" width={'100px'} />
            </Link>
          ))}
        </div>
        <div className='products'>
          {links.map((link, index) => (
            <div key={index} className="nav-link-container">
              <Link key={index} to={link.href} className="nav-link">
                <img src={link.icon} alt={link.name} width={'30px'} />
                {link.name}
                <div className="nav-link-underline"></div>
              </Link>
            </div>
          ))}
        </div>
        <div className='shop'>
          {shop.map((link, index) => (

            <Link key={index} to={link.href} className='nav-link'>
              <img src={link.icon} alt="" width={'30px'} />
              <div key={index} className="nav-link-container">
                {link.name}
                <div className="nav-link-underline"></div>
              </div>
            </Link>
          ))}
        </div>
    </nav>
  );
};

export default NavBar;
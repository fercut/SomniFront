import React from 'react';
import { Link } from 'react-router-dom';
import '../style/NavBar.css';
import ring from '../assets/ring.png';
import bracelets from '../assets/bracelets.png';
import chokers from '../assets/chokers.png';
import earrings from '../assets/earrings.png';
import chains from '../assets/chains.png';
import pendants from '../assets/pendants.png';
import homeIcon from '../assets/home.png';
import loginIcon from '../assets/login.png';
import carritoIcon from '../assets/carrito.png';
import contactoIcon from '../assets/contacto.png';

const links = [
  {
    name: "Anillos",
    href: "/rings",
    icon: ring,
  },
  {
    name: "Pulseras",
    href: "/bracelets",
    icon: bracelets,
  },
  {
    name: "Gargantillas",
    href: "/chokers",
    icon: chokers,
  },
  {
    name: "Pendientes",
    href: "/earrings",
    icon: earrings,
  },
  {
    name: "Cadenas",
    href: "/chains",
    icon: chains,
  },
  {
    name: "Colgantes",
    href: "/pendants",
    icon: pendants,
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
    icon: loginIcon
  },
  {
    name: "",
    href: "/shoppingCart",
    icon: carritoIcon
  },
  {
    name: "",
    href: "/contact",
    icon: contactoIcon
  },
]

const NavBar = () => {
  return (
    <nav>
        <div className='home'>
          {home.map((link, index) => (
            <Link key={index} to={link.href}>
              <img src= {homeIcon} alt="home" width={'100px'} />
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
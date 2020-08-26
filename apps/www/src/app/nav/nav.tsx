import React from 'react';
import './nav.scss';
import logo from '../../assets/icons/cuarentrivia-logo.png';

interface Nav {
  children: React.ReactNode;
}

const Nav = ({ children }: Nav) => {
  return (
    <>
      <nav className="nav">
        <img src={logo} alt="Logo" className="nav-logo" />
      </nav>
      <section className="children">
      {children}
      </section>
    </>
  );
};

export default Nav;

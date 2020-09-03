import React from 'react';
import './nav.scss';
import logo from '../../assets/icons/cuarentrivia-logo.png';
import firebase from 'firebase/app';
import { useHistory } from 'react-router-dom';

interface Nav {
  children: React.ReactNode;
}

const Nav = ({ children }: Nav) => {
  const history = useHistory();

  const handleLogout = async () => {
    await firebase.auth().signOut();
    history.push('/login');
  };

  return (
    <>
      <nav className="nav">
        <img src={logo} alt="Logo" className="nav-logo" />
        <a
          role="button"
          className="nav-logout"
          href="#logout"
          onClick={handleLogout}
        >
          Logout
        </a>
      </nav>
      <section className="children">{children}</section>
    </>
  );
};

export default Nav;

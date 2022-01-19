import React from 'react';
import './index.scss';
import logo from '../../assets/icons/cuarentrivia-logo.png';
import firebase from 'firebase/compat/app';
import { useNavigate, Link } from 'react-router-dom';

interface Nav {
  children: React.ReactNode;
  notShowLogout?: boolean;
}

const Nav = ({ children, notShowLogout }: Nav) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await firebase.auth().signOut();
    navigate('/login');
  };

  return (
    <>
      <nav className="nav">
        <Link to="/">
          <img src={logo} alt="Logo" className="nav-logo" />
        </Link>
        {!notShowLogout && (
          <a
            role="button"
            className="nav-logout"
            href="#logout"
            onClick={handleLogout}
          >
            Logout
          </a>
        )}
      </nav>
      <section className="children">{children}</section>
    </>
  );
};

export default Nav;

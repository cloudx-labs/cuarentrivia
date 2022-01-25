import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {  } from 'firebase/app'
import { getAuth, signOut } from 'firebase/auth';

import './index.scss';

interface Nav {
  children: React.ReactNode;
  notShowLogout?: boolean;
}

const Nav = ({ children, notShowLogout }: Nav) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    navigate('/login');
  };

  return (
    <>
      <nav className="nav">
        <Link to="/"></Link>
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

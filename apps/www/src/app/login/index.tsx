import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FirebaseAuth } from 'react-firebaseui';
import { getAuth, UserCredential } from 'firebase/auth';
import Nav from '../nav';
import { useQuery } from '../shared/use-query.hook';
import useTitle from '../shared/use-title.hook';
import { environment } from '../../environments/environment';
import './index.scss';

const Login = () => {
  const navigate = useNavigate();

  const query = useQuery();

  const signInSuccessWithAuthResult = (authResult: UserCredential): boolean => {
    if (!authResult.user) {
      return false;
    }

    const redirectTo = query.get('redirectTo') || '/';

    navigate(redirectTo);

    return true;
  };

  const authProps = {
    uiConfig: {
      signInOptions: environment.firebaseUi.signInOptions,
      callbacks: { signInSuccessWithAuthResult },
    },
    firebaseAuth: getAuth(),
  };

  useTitle('Login');

  return (
    <Nav notShowLogout={true}>
      <main className="login">
        <section className="login-content">
          <img src="" alt="Logo" className="login-content-logo" />
          <h1 className="login-content-title">Sign In</h1>
          <FirebaseAuth {...authProps} />
        </section>
      </main>
    </Nav>
  );
};

export default Login;

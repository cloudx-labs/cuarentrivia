import React from 'react';
import { useHistory } from 'react-router-dom';
import { FirebaseAuth } from 'react-firebaseui';
import firebase from 'firebase/app';
import useTitle from '../shared/use-title.hook';
import { useQuery } from '../shared/use-query.hook';
import logo from '../../assets/icons/android-icon-36x36.png';
import './index.scss';
import Nav from '../nav';
import { environment } from '../../environments/environment';

const Login = () => {
  const history = useHistory();
  const query = useQuery();

  const signInSuccessWithAuthResult = (
    authResult: firebase.auth.UserCredential
  ): boolean => {
    if (!authResult.user) {
      return false;
    }

    const redirectTo = query.get('redirectTo') || '/';

    history.push(redirectTo);

    return true;
  };
  const uiConfig: firebaseui.auth.Config = {
    signInOptions: environment.firebaseUi.signInOptions,
    callbacks: {
      signInSuccessWithAuthResult,
    },
  };
  const firebaseAuth = firebase.auth();

  useTitle('Login');

  return (
    <Nav>
      <main className="login">
        <section className="login-content">
          <img src={logo} alt="Logo" className="login-content-logo" />
          <h1 className="login-content-title">Sign In</h1>
          <FirebaseAuth uiConfig={uiConfig} firebaseAuth={firebaseAuth} />
        </section>
      </main>
    </Nav>
  );
};

export default Login;

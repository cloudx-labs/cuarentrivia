import React from 'react';
import { useHistory } from 'react-router-dom';
import { FirebaseAuth } from 'react-firebaseui';
import firebase from 'firebase/app';
import useTitle from '../shared/use-title.hook';
import { useQuery } from '../shared/use-query.hook';

const Login = () => {
  const history = useHistory();
  const query = useQuery();

  const googleAuthProvider = {
    provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    scopes: [],
    customParameters: {
      hd: 'cloudx.com',
    },
  };
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
    signInOptions: [googleAuthProvider],
    callbacks: {
      signInSuccessWithAuthResult,
    },
  };
  const firebaseAuth = firebase.auth();

  useTitle('Login');

  return <FirebaseAuth uiConfig={uiConfig} firebaseAuth={firebaseAuth} />;
};

export default Login;

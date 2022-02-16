import { BrowserRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import Login from './index';

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn().mockReturnValue([{ uid: 'uuid' }, true, false]),
  GoogleAuthProvider: { PROVIDER_ID: '' },
  EmailAuthProvider: { PROVIDER_ID: '' },
}));

interface UiConfig {
  callbacks: {
    signInSuccessWithAuthResult(authResult: { user: { uid: string } }): boolean;
  };
}

jest.mock('react-firebaseui', () => ({
  FirebaseAuth: (props: { uiConfig: UiConfig }) => (
    <button
      name="login-button"
      onClick={() =>
        props.uiConfig.callbacks.signInSuccessWithAuthResult({
          user: { uid: 'uuid' },
        })
      }
    >
      Login
    </button>
  ),
}));

describe('Login', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(baseElement).toBeTruthy();
  });
});

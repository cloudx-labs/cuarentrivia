import { BrowserRouter } from 'react-router-dom';
import { User } from 'firebase/auth';
import { render } from '@testing-library/react';
import Login from './index';
import initFirebase from '../shared/init-firebase';
import { environment } from '../../environments/environment';

const mockedUsedNavigate = jest.fn();

const mockedUseLocation = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
  useLocation: () => mockedUseLocation,
}));

const user: User = {
  displayName: 'user',
  email: 'user',
  phoneNumber: '',
  photoURL: '',
  providerId: '',
  uid: 'uuid',
  emailVerified: true,
  isAnonymous: true,
  metadata: {},
  providerData: [],
  refreshToken: '',
  tenantId: null,
  delete: () => new Promise(() => null),
  getIdToken: () => new Promise(() => ''),
  getIdTokenResult: () => new Promise(() => null),
  reload: () => new Promise(() => null),
  toJSON: () => ({}),
};

const getAuth = jest.fn();

describe('Login', () => {
  beforeAll(() => {
    initFirebase();

    jest.mock('firebase/auth', () => ({
      getAuth,
    }));

    jest.mock('react-firebase-hooks/auth', () =>
      jest.fn().mockImplementation(() => ({
        useAuthState: getAuth,
      }))
    );

    jest.mock('react-firebaseui/FirebaseAuth', () => ({
      ...jest.requireActual('react-firebaseui/FirebaseAuth'),
      uiConfig: {
        signInOptions: environment.firebaseUi.signInOptions,
        callbacks: { signInSuccessWithAuthResult: jest.fn() },
      },
      firebaseAuth: () => getAuth,
    }));

    getAuth.mockReturnValue([user, true, false]);
  });

  it('should render successfully', () => {
    const { baseElement } = render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(baseElement).toBeTruthy();
  });
});

import { render } from '@testing-library/react';

import App from './app';
import initFirebase from './shared/init-firebase';
import { Auth } from 'firebase/auth'

const mockAuth = jest.fn();

describe('App', () => {
  beforeAll(() => {
    jest.mock('firebase/auth', () => {
      return {
        getAuth: jest.fn()
      }
    });

    jest.mock('react-firebase-hooks/auth', () => {
      return jest.fn().mockImplementation(() => {
        return { useAuthState: mockAuth };
      });
    });

    mockAuth.mockReturnValue([{ uid: 'uuid'}, true, false]);
  });

  it.skip('should render successfully', () => {
    const { baseElement } = render(<App />);

    expect(baseElement).toBeTruthy();
  });

  it.skip('should have "Sign In" as title', () => {
    const { getByText } = render(<App />);

    expect(getByText(/Sign In/gi)).toBeTruthy();
  });
});

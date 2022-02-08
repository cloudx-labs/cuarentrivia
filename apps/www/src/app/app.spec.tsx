import { render } from '@testing-library/react';
import App from './app';
import initFirebase from './shared/init-firebase';

const mockAuth = jest.fn();

describe('App', () => {
  beforeAll(() => {
    jest.mock('react-firebase-hooks/auth', () => {
      return jest.fn().mockImplementation(() => {
        return { useAuthState: mockAuth };
      });
    });

    mockAuth.mockReturnValue([true, false]);

    initFirebase();
  });

  it('should render successfully', () => {
    const { baseElement } = render(<App />);

    expect(baseElement).toBeTruthy();
  });

  it('should have "Sign In" as title', () => {
    const { getByText } = render(<App />);

    expect(getByText(/Sign In/gi)).toBeTruthy();
  });
});

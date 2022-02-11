import { render } from '@testing-library/react';

import App from './app';
import initFirebase from './shared/init-firebase';

jest.mock('./home', () => ({
  __esModule: true,
  default: () => <div>Home</div>,
}));

jest.mock('./login', () => ({
  __esModule: true,
  default: () => <div>Login</div>,
}));

jest.mock('./play', () => ({
  __esModule: true,
  default: () => <div>Play</div>,
}));

describe('App', () => {
  const initialPathname = '/';

  beforeAll(() => {
    initFirebase();
  });

  beforeEach(() => {
    window.history.pushState({}, document.title, initialPathname);
  });

  it('should render successfully', () => {
    const { baseElement } = render(<App />);

    expect(baseElement).toBeTruthy();
  });

  it('should route to "login" successfully', () => {
    const loginPath = 'login';

    window.history.pushState({}, document.title, loginPath);

    const { getByText } = render(<App />);

    expect(getByText(/Login/gi)).toBeTruthy();
  });

  it('should route to "play" successfully', () => {
    const playPath = 'play/fake-id';

    window.history.pushState({}, document.title, playPath);

    const { getByText } = render(<App />);

    expect(getByText(/Play/gi)).toBeTruthy();
  });
});

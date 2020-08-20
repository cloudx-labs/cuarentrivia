import React from 'react';
import { render } from '@testing-library/react';

import App from './app';

jest.mock('./login', () => 'Login');
jest.mock('./join', () => 'Join');
jest.mock('./create', () => 'Create');

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<App />);

    expect(baseElement).toBeTruthy();
  });
});

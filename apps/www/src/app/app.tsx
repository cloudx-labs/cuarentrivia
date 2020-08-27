import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import './app.scss';

import Login from './login';
import Play from './play';
import Home from './home';

export const App = () => {
  return (
    <BrowserRouter>
      <Route exact path="/login" component={Login} />
      <Route exact path="/play/:triviaId" component={Play} />
      <Route path="/" component={Home} />
    </BrowserRouter>
  );
};

export default App;

import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';

import './app.scss';

import Login from './login';
import Play from './play';
import Home from './home';

export const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/play/:triviaId">
          <Play />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default App;

import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import './app.scss';

import Login from './login';
import Join from './join';
import Create from './create';
import Play from './play';

export const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/create" component={Create} />
        <Route exact path="/trivias/:triviaId" component={Play} />
        <Route exact path="/" component={Join} />
        <Redirect to="/" />
      </Switch>
    </BrowserRouter>
  );
};

export default App;

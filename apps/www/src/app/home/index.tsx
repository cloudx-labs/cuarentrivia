import React from 'react';
import { Switch, Route, useLocation, useHistory } from 'react-router-dom';

import Join from '../join';
import Trivias from '../trivias';
import Create from '../create';

import './index.scss';

const Home = () => {
  return (
    <div className="home">
      <div className="home-content">
        <Switch>
          <Route exact path="/trivias" component={Trivias} />
          <Route path="/trivias/create" component={Create} />
          <Route exact path="/" component={Join} />
        </Switch>
      </div>
    </div>
  );
};

export default Home;

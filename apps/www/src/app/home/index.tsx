import React from 'react';
import {
  Switch,
  Route,
  Redirect,
  useLocation,
  useHistory,
} from 'react-router-dom';
import { Gamepad, List } from '@material-ui/icons';

import Join from '../join';
import Trivias from '../trivias';
import Create from '../create';
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';

import './index.scss';

const Home = () => {
  const { pathname } = useLocation();
  const history = useHistory();

  const goToPath = (path: string) => history.push(path);

  return (
    <div className="home">
      <div className="home-content">
        <Switch>
          <Route exact path="/trivias" component={Trivias} />
          <Route path="/trivias/create" component={Create} />
          <Route exact path="/" component={Join} />
        </Switch>
      </div>
      <BottomNavigation
        value={pathname}
        onChange={(event, value) => goToPath(value)}
      >
        <BottomNavigationAction label="Join" value="/" icon={<Gamepad />} />
        <BottomNavigationAction
          label="My trivias"
          value="/trivias"
          icon={<List />}
        />
      </BottomNavigation>
    </div>
  );
};

export default Home;

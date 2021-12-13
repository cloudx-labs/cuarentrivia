import React from 'react';
import { Route, BrowserRouter, Routes } from 'react-router-dom';

import './app.scss';

import Login from './login';
import Play from './play';
import Home from './home';

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/play/:triviaId" element={<Play />} />
        <Route path="/*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

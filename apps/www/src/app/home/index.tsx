import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Join from '../join';
import Trivias from '../trivias';
import Create from '../create';

import './index.scss';

const Home = () => {
  return (
    <div className="home">
      <div className="home-content">
        <Routes>
          <Route path="/trivias" element={<Trivias />} />
          <Route path="/trivias/create" element={<Create />} />
          <Route path="/" element={<Join />} />
        </Routes>
      </div>
    </div>
  );
};

export default Home;

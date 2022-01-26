import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Create from '../create';

import './index.scss';

const Home = () => {
  return (
    <div className="home">
      <div className="home-content">
        <Routes>
          <Route path="/trivias/create" element={<Create />} />
        </Routes>
      </div>
    </div>
  );
};

export default Home;

import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Create from '../create';
import Join from '../join';
import Trivias from '../trivias';

import './index.scss';

const Home = () => {
  return (
    <div className="home">
      <div className="home-content">
        <Routes>
          <Route path="trivias" element={<Trivias />} />
          <Route path="create" element={<Create />} />
          <Route path="*" element={<Join />} />
        </Routes>
      </div>
    </div>
  );
};

export default Home;

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from './home'
import Login from './login';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

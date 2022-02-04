import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from './home'
import Login from './login';
import Play from './play';

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="/*" element={<Home />} />
        <Route path="play/:triviaId" element={<Play />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

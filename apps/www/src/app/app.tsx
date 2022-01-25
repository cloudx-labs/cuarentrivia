import { BrowserRouter, Route, Routes } from 'react-router-dom';

import NxWelcome from './nx-welcome';
import Login from './login';
import Authenticate, { AuthenticatedProps } from './shared/authenticate';

const Component = ({ user }: AuthenticatedProps) => {
  console.log(user);

  return <NxWelcome title={`${user}'s www`} />;
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Authenticate component={Component} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

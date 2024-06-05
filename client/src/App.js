import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/Login.js';
import Home from './pages/Home.js';
import Register from './pages/Register.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;

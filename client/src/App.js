import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/Login.js';
import Home from './pages/Home.js';
import Register from './pages/Register.js';
import CreateDiscussion from './pages/CreateDiscussion.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/newdiscussion" element={<CreateDiscussion />} />
      </Routes>
    </Router>
  );
}

export default App;

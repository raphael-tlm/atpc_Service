import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import {AuthProvider} from './assets/components/custom/hooks/AuthProvider.js';

import Home from './pages/Home.js';
import Login from './pages/Login.js';
import Register from './pages/Register.js';
import PrivateRoute from './assets/components/custom/router/route.js';

import './app.css';
import NewDiscussion from './pages/NewDiscussion.js';

function App() {
  return (
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/connexion" element={<Login />} />
            <Route path="/inscription" element={<Register />} />
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="nouvelle-discussion" element={<NewDiscussion />}/>
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
  );
}

export default App;

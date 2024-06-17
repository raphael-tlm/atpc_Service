import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import {AuthProvider} from './assets/components/custom/hooks/AuthProvider.js';

import Home from './pages/Home.js';
import Login from './pages/Login.js';
import Register from './pages/Register.js';
import Discussion from './pages/Discussion.js';
import NewDiscussion from './pages/NewDiscussion.js';
import ListDiscussion from './pages/ListDiscussion.js';

import './app.css';

import { useEffect, useState } from 'react';
import Loading from './assets/components/Loading.js';
import PrivateRoute from './assets/components/custom/router/route.js';

function App() {

  const [overideStyle, setOverideStyle] = useState()

  useEffect(() => {
    const load = () => {
      setOverideStyle({
        display: 'none'
    })
  }
   
  load();
  }, [window]);


  return (
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/connexion" element={<Login />} />
            <Route path="/inscription" element={<Register />} />
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Home />} />
            </Route>
            <Route element={<PrivateRoute />}>
              <Route path="nouvelle-discussion" element={<NewDiscussion />}/>
            </Route>
            <Route element={<PrivateRoute />}>
              <Route path="discussion" element={<Discussion />}/>
            </Route>
            <Route element={<PrivateRoute />}>
              <Route path="liste-discussion" element={<ListDiscussion />}/>
            </Route>
          </Routes>
        </AuthProvider>
      <Loading overideStyle={overideStyle}/>
      </Router>
  );
}

export default App;

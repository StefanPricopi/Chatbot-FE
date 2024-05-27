import React, { useEffect } from 'react';
import { useState, useRef } from 'react'
import './App.css'
import HomePage from './pages/HomePage'
import LogsPage from './pages/Logs_Dash/LogsPage'
import { BrowserRouter as Router,Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Index from './pages/HomePage_Site/Index';
import LoginForm from './components/LoginForm';
import TokenManager from './api/TokenManager';
import AuthAPI from './api/AuthAPI';
import LoginDashboard from './pages/LoginDashboard/LoginDashboard';

function App() {
  const [claims, setClaims] = useState(TokenManager.getClaims());
  const userInfo = useRef({id:0, token: ""});
  const [authorized, setAuthorized] = useState(false);

  const [loading, isLoading] = useState(true);


  const handleLogin = (username, password) => {
    AuthAPI.login(username, password)
      .catch(() => alert("Login failed!"))
      .then(claims => {
        setClaims(claims);
        userInfo.current = {id: claims.studentId, token: TokenManager.getAccessToken()};
        })
      .catch(error => console.error(error));
    };

    useEffect(() => {
      let  token = TokenManager.getAccessToken();

      if(token == null)
      {
          handleLogout();
      }
      else {
        setAuthorized(true);
      }
      isLoading(false);
    },[]);

  const handleLogout = () => {
    TokenManager.clear();
    setClaims(null);
    userInfo.current = {};
    setAuthorized(false);
  };

  if(loading){
    return <div>Loading..</div>
  }

  return (
    <div>
        <div className="App">
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<LoginDashboard handleLogin={handleLogin}/>} />
              <Route path="/home" element={authorized ? <HomePage /> : <Navigate to="/login" />} />
              <Route path="/logs" element={authorized ? <LogsPage userInfo={userInfo.current}/> : <Navigate to="/login" />} />
              <Route path="*" element={<Navigate to="/login"/>}/>              
            </Routes>
          </Router>
        </div>
    </div>
  )
}

export default App

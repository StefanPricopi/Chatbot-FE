import React from 'react';
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
  const [loginSuccess, setLoginSuccess] = useState(false);
  const userInfo = useRef({id:0, token: ""});

  const handleLogin = (username, password) => {
    AuthAPI.login(username, password)
      .catch(() => alert("Login failed!"))
      .then(claims => {
        setClaims(claims);
        userInfo.current = {id: claims.studentId, token: TokenManager.getAccessToken()};


        setLoginSuccess(true);
        
        })
      .catch(error => console.error(error));
    };



  const handleLogout = () => {
    TokenManager.clear();
    setClaims(null);
    userInfo.current = {};
  };


  return (
    <div>
        <div className="App">
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<LoginDashboard handleLogin={handleLogin}/>} />

              <Route path="/home" element={loginSuccess ? <HomePage /> : <Navigate to="/login" />} />
              <Route path="/logs" element={loginSuccess ? <LogsPage userInfo={userInfo.current}/> : <Navigate to="/login" />} />

              <Route path="*" element={<Navigate to="/login"/>}/>


              
            </Routes>
          </Router>
        </div>
    </div>
  )

  return (
    <div>
      <h1>My App</h1>
      {claims ? (
        <div>
          <p>Welcome, {claims.sub}</p>
          {studentDetails &&
            <StudentDetails studentDetails={studentDetails} />
          }
          <button onClick={handleLogout}>Logout</button>
          <br />
          <a href='/' target='_blank'>Open in new Tab</a>
        </div>
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </div>
  );

}

export default App

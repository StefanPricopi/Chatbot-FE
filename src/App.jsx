import React from 'react';
import { useState } from 'react'
import './App.css'
import HomePage from './pages/HomePage'
import LogsPage from './pages/Logs_Dash/LogsPage'
import NavBar from './components/NavBar'
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Index from './pages/HomePage_Site/Index';
import LoginForm from './components/LoginForm';
import TokenManager from './api/TokenManager';
import AuthAPI from './api/AuthAPI';

function App() {
  const [claims, setClaims] = useState(TokenManager.getClaims());
  const [customerDetails, setCustomerDetails] = useState(null);

  const handleLogin = (username, password) => {
    AuthAPI.login(username, password)
      .catch(() => alert("Login failed!"))
      .then(claims => setClaims(claims))
      .then(getStudentDetails)
      .catch(error => console.error(error));
  }

  const handleLogout = () => {
    TokenManager.clear();
    setClaims(null);
    setCustomerDetails(null);
  }


  return (
    <div>
      {claims ? (
            <div className="App">
              <Router>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/home" element={<Index />} />
                  <Route path="/logs" element={<LogsPage />} />
      
                </Routes>
              </Router>
            </div>
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}

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

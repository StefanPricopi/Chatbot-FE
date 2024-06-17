import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import LogsPage from './pages/Logs_Dash/LogsPage';
import StatisticsPage from './pages/Statistics/StatisticsPage';
import Index from './pages/HomePage_Site/Index';
import LoginDashboard from './pages/LoginDashboard/LoginDashboard';
import TokenManager from './api/TokenManager';
import AuthAPI from './api/AuthAPI';

function App() {
    const [claims, setClaims] = useState(TokenManager.getClaims());
    const userInfo = useRef({ id: 0, token: "", role: "" });
    const [authorized, setAuthorized] = useState(false);
    const [loading, isLoading] = useState(true);

  const handleLogin = (username, password) => {
    AuthAPI.dashLogin(username, password)
    .catch(() => alert("Login failed!"))
    .then(token => {
        TokenManager.setAccessToken(token.data.accessToken);
        setClaims(TokenManager.getClaims());
        let localclaims = TokenManager.getClaims();
        userInfo.current = {id: localclaims.studentId, token: token.data.accessToken};
        console.log(userInfo);
        setAuthorized(true);
        done = true;
    })
    .catch(error => console.error(error));

    };

    useEffect(() => {
        console.log("Hits here first.");

        let currtoken = TokenManager.getAccessToken();
        let claims = TokenManager.getClaims();

        if (currtoken == null || claims == null) {
            console.log("Ohh no we're logged out");
            handleLogout();
        } else {
            console.log("We are logged in apparently");
            setAuthorized(true);
            console.log(authorized);
            userInfo.current = { id: claims.studentId, token: currtoken, role: claims.roles[0] };
            console.log(userInfo.current);
          }
        isLoading(false);
        
    }, []);

    const handleLogout = () => {
        console.log("we have logged out");
        TokenManager.clear();
        setClaims(null);
        userInfo.current = {};
        setAuthorized(false);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<LoginDashboard handleLogin={handleLogin} />} />
                    {console.log(`is authorized: ${authorized}`)}
                    {console.log(`our role: ${userInfo.current.role}`)}
                    {console.log(`is admin: ${userInfo.current.role == "ADMIN"}`)}
                    <Route path="/home" element={authorized && userInfo.current.role === "ADMIN" ? <HomePage /> : <Navigate to="/login" />} />
                    <Route path="/logs" element={authorized && userInfo.current.role === "ADMIN" ? <LogsPage userInfo={userInfo.current} /> : <Navigate to="/login" />} />
                    <Route path="/statistics" element={authorized && userInfo.current.role === "ADMIN" ? <StatisticsPage userInfo={userInfo.current} /> : <Navigate to="/statistics" />} />
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </Router>
        </div>
  )

}

export default App;

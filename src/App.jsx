import React from 'react';
import { useState } from 'react'
import './App.css'
import HomePage from './pages/HomePage'
import LogsPage from './pages/Logs_Dash/LogsPage'
import NavBar from './components/NavBar'
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Index from './pages/HomePage_Site/Index';

function App() {
  return (
    <>
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<Index />} />
          <Route path="/logs" element={<LogsPage />} />

        </Routes>
      </Router>
    </div>
    </>
  )
}

export default App

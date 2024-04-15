import React from 'react';
import { useState } from 'react'
import './App.css'
import HomePage from './pages/HomePage'
import ChatbotPage from './pages/ChatbotPage' // Assuming you have a ChatbotPage component
import LogsPage from './pages/Logs_Dash/LogsPage'
import NavBar from './components/NavBar'
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <>
    <div className="App">
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<ChatbotPage />} />
          <Route path="/logs" element={<LogsPage />} />

        </Routes>
      </Router>
    </div>
    </>
  )
}

export default App

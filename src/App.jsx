import { useState } from 'react'
import './App.css'
import HomePage from './pages/HomePage'
import ChatbotPage from './pages/ChatbotPage' // Assuming you have a ChatbotPage component
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
        </Routes>
      </Router>
    </div>
    </>
  )
}

export default App

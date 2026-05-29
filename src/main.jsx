import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import PrivacyPolicy from './components/PrivacyPolicy.jsx'
import CookiePolicy from './components/CookiePolicy.jsx'
import Services from './components/Services.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/services" element={<Services />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)

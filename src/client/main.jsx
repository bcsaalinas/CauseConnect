import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import LoginPage from './pages/LoginPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import DirectoryPage from './pages/DirectoryPage.jsx';
import SDGPage from './pages/SDGPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import WelcomePage from './pages/WelcomePage.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<App />}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

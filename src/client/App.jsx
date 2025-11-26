import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import SkipLink from './components/SkipLink';
import ScrollManager from './components/ScrollManager';
import { useGSAPAnimation } from './hooks/useGSAPAnimation';

import HomePage from './pages/HomePage';
import DirectoryPage from './pages/DirectoryPage';
import SDGPage from './pages/SDGPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import DashboardPage from './pages/DashboardPage';
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

function MainRoutes() {
  const location = useLocation();
  const flushHome = location.pathname === "/";
  return (
    <main id="main-content" className={flushHome ? "page-main page-main--flush" : "page-main"}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/directory" element={<DirectoryPage />} />
        <Route path="/sdgs" element={<SDGPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </main>
  );
}

function App() {
  useGSAPAnimation();
  return (
    <>
      <SkipLink />
      <Header />
      <ScrollManager />
      <MainRoutes />
      <Footer />
    </>
  );
}

export default App;

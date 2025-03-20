import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Listing from "./pages/Listing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { CurrencyProvider } from "./context/CurrencyContext";

// Import Admin App
import AdminApp from "./admin-frontend/App";

const AppContent = () => {
  const location = useLocation();
  const isSearchPage = location.pathname === '/search';
  const isListingPage = location.pathname.includes('/listing/');
  const isAdminPage = location.pathname.includes('/admin');
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div>
      {!isSearchPage && !isListingPage && !isAdminPage && !isAuthPage && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/listing/:id" element={<Listing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<Navigate to="/admin/view-listings" replace />} />
        <Route path="/admin/*" element={<AdminApp />} />
      </Routes>
      {!isAdminPage && !isAuthPage && <Footer />}
    </div>
  );
};

function App() {
  return (
    <CurrencyProvider>
      <Router>
        <AppContent />
      </Router>
    </CurrencyProvider>
  );
}

export default App;

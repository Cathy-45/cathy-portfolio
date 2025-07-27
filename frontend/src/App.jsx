import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Loader from './components/Loader';
import Home from './components/Home';
import Navbar from './components/Navbar';
import Products from './components/Products';

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 5000); // Simulate loading
  }, []);

  return (
    <Router>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/consultation" element={<div>Consultation (TBD)</div>} />
            <Route path="/contact" element={<div>Contact (TBD)</div>} />
          </Routes>
        </>
      )}
    </Router>
  );
};

export default App;
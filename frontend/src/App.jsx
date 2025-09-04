import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Loader from './components/Loader';
import Home from './components/Home';
import Navbar from './components/Navbar';
import Products from './components/Products';
import Contact from './components/Contact';
import Consultation from './components/Consultation';
import FullStackDevelopment from './components/Products/FullStackDevelopment';
import TechnologyConsulting from './components/Products/TechnologyConsulting';
import SystemIntegration from './components/Products/SystemIntegration';
import SaaS from './components/Products/SaaS';
import Myportfolio from './components/MyPortfolio';
import Success from './components/Success';
const App = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => setLoading(false), 5000);
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
            <Route path="/products/full-stack-development" element={<FullStackDevelopment />} />
            <Route path="/products/technology-consulting" element={<TechnologyConsulting />} />
            <Route path="/products/system-integration" element={<SystemIntegration />} />
            <Route path="/products/saas" element={<SaaS />} />
            <Route path="/consultation" element={<Consultation />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/portfolio" element={<Myportfolio />} />
            <Route path="/success" element={<Success />} />
          </Routes>
        </>
      )}
    </Router>
  );
};
export default App;

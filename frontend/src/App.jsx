import React, { useState, useEffect } from 'react';
import Loader from './components/Loader';
import Home from './components/Home';

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 5000); // Simulate loading
  }, []);

  return (
    <div>
      {loading ? <Loader /> : <Home />}
    </div>
  );
};

export default App;

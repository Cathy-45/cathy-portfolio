import React from 'react';

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#1a1a1a] z-50">
      <div className="w-16 h-16 rounded-full animate-loader-spin" style={{
        background: 'conic-gradient(#ff6f61, #4CAF50, #1E90FF, #FFD700, #ff6f61)',
      }}></div>
    </div>
  );
};

export default Loader;
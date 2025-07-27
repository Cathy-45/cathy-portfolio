import React from 'react';

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#1a1a1a] z-50">
      <div className="cube-container w-64 h-64">
        <div className="cube animate-cube-spin">
          <div className="face front" style={{ backgroundColor: '#ff6f61' }}></div>
          <div className="face back" style={{ backgroundColor: '#4CAF50' }}></div>
          <div className="face right" style={{ backgroundColor: '#1E90FF' }}></div>
          <div className="face left" style={{ backgroundColor: '#FFD700' }}></div>
          <div className="face top" style={{ backgroundColor: '#FFFFFF' }}></div>
          <div className="face bottom" style={{ backgroundColor: '#FF4500' }}></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
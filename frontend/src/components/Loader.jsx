import React from 'react';
import './Loader.css';

const Loader = () => {
  const welcomeText = 'Welcome to My Portfolio';
  const colors = ['#ff6f61', '#4CAF50', '#1E90FF', '#FFD700', '#fdba74', '#ffffff', '#ff6f61', '#4CAF50', '#1E90FF', '#FFD700', '#fdba74', '#ffffff', '#ff6f61', '#4CAF50', '#1E90FF', '#FFD700', '#fdba74', '#ffffff', '#ff6f61', '#4CAF50', '#1E90FF'];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#1a1a1a] z-50 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center flex-wrap text-center"> {/* Added text-center for better alignment */}
        {welcomeText.split('').map((letter, index) => (
          <span
            key={index}
            className="welcome-letter text-[5vw] sm:text-[6vw] md:text-[4rem] lg:text-[5rem]" // Using viewport units for responsive font size
            style={{
              color: colors[index % colors.length],
              animationDelay: `${index * 0.1}s`,
            }}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </span>
        ))}
      </div>
      <div className="cube-container w-10 sm:w-12 md:w-16 lg:w-20 relative z-10">
        <div className="cube animate-cube-spin">
          <div className="face front bg-[#ff6f61]"></div>
          <div className="face back bg-[#4CAF50]"></div>
          <div className="face right bg-[#1E90FF]"></div>
          <div className="face left bg-[#FFD700]"></div>
          <div className="face top bg-white"></div>
          <div className="face bottom bg-[#fdba74]"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
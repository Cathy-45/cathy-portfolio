import React from 'react';
import { Link } from 'react-router-dom';
import backgroundImage from '../assets/background.jpg';
const Home = () => {
  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center bg-[#1a1a1a] text-white bg-contain bg-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundBlendMode: 'overlay',
        backgroundColor: 'rgba(26, 26, 26, 0.96)',
        opacity: 0.3,
        backgroundPosition: 'contain',
      }}
    >
      <div className="flex flex-col items-center text-center space-y-4 sm:space-y-6 px-4 sm:px-6">
        <div className="text-4xl sm:text-6xl animate-wave">👋</div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-poppins font-bold text-[#fdba74]">
          Hi, I'm Cathy, A Maiden Software Engineer
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl font-roboto font-bold text-[#fdba74]">
          Passionate about building innovative solutions for the digital world.
        </p>
        <Link
          to="/products"
          className="bg-[#3f3f46] text-[#fb923c] font-poppins text-sm sm:text-lg py-2 px-4 rounded"
        >
          See How I Can Help
        </Link>
      </div>
    </section>
  );
};
export default Home;

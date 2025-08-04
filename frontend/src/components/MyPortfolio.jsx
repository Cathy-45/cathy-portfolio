import React from 'react';
import { Link } from 'react-router-dom';
import treeTopBnBImage from '../assets/treeTopBnB.jpg';
import birthdayPagesImage from '../assets/Birthday-Pages.jpg';
import cathyPortfolioImage from '../assets/cathy-portfolio.jpg';
import backgroundImage from '../assets/background.jpg';

const MyPortfolio = () => {
  const projects = [
    {
      id: 1,
      name: 'treeTopBnB',
      description: 'AirBnB-inspired platform with user authentication and booking system',
      image: treeTopBnBImage,
      bgColor: 'bg-[#4CAF50]',
      path: 'https://github.com/Cathy-45/treeTopBnB',
    },
    {
      id: 2,
      name: 'Birthday-Pages',
      description: 'Interactive birthday webpage with confetti and music',
      image: birthdayPagesImage,
      bgColor: 'bg-[#1E90FF]',
      path: 'https://github.com/Cathy-45/Birthday-Pages',
    },
    {
      id: 3,
      name: 'cathy-portfolio',
      description: 'Personal portfolio showcasing my software projects',
      image: cathyPortfolioImage,
      bgColor: 'bg-[#ff6f61]',
      path: 'https://github.com/Cathy-45/cathy-portfolio',
    },
  ];

  return (
    <section className="min-h-screen bg-[#1a1a1a] text-white flex flex-col items-center justify-center p-4 sm:p-6 md:p-10 relative">
      <div
        className="absolute inset-0 bg-contain bg-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundBlendMode: 'overlay',
          backgroundColor: 'rgba(26, 26, 26, 0.99)',
          opacity: 0.2,
        }}
      ></div>
      <div className="relative z-10 text-center">
        <div className="text-4xl sm:text-6xl animate-wave mb-4 sm:mb-6">👨‍💻</div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-poppins font-bold mb-8 sm:mb-12 text-[#fdba74]">
          My Projects
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={project.path}
              target="_blank"
              rel="noopener noreferrer"
              className="relative rounded-lg shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300"
            >
              <img
                src={project.image}
                alt={project.name}
                className="w-full h-48 sm:h-64 object-cover"
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/800x600?text=${project.name}`;
                }}
              />
              <div className={`${project.bgColor} p-4`}>
                <h3 className="text-lg sm:text-xl font-poppins font-semibold text-[#475569] mb-2">
                  {project.name}
                </h3>
                <p className="text-sm sm:text-base font-roboto-mono text-[#475569] text-center">
                  {project.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MyPortfolio;
import React from "react";
import { Link } from "react-router-dom";

const Myportfolio = () => {
  const projects = [
    {
      id: 1,
      name: "treeTopBnB",
      description: "AirBnB model",
      bgColor: "bg-[#1E90FF]",
      path: "https://github.com/Cathy-45/treeTopBnB",
    },

    {
      id: 2,
      name: "Birthday-Pages",
      description: "digital birthday card",
      bgColor: "bg-[#4CAF50]",
      path: "https://github.com/Cathy-45/Birthday-Pages",
    },
    {
      id: 3,
      name: "cathy-portfolio",
      description: "personal portfolio",
      bgColor: "bg-[#ff6f61]",
      path: "https://github.com/Cathy-45/Birthday-Pages",
    },
  ];
  return (
    <section className="min-h-screen bg-[#1a1a1a] text-white sm:p-6 md:p-10">
      <h2 className="text-6xl sm:text-4xl md:text-5xl lg:text-6xl font-poppins font-bold mb-16 mb-8 sm:mb-12 md text-center text-[#fdba74]">
        My Projects
      </h2>
      <div className="grid grid-cols-2 gap-6 sm:gap-8 md:gap-14 max-w-4xl mx-auto text-[#fb7185]">
        {projects.map((project) => (
          <Link
            key={project.id}
            to={project.path}
            className={`${project.bgColor} w-128 h-64 rounded-lg shadow-xl flex flex-col items-center justify-center p-8 hover:opacity-90 transition-opacity`}
          >
            <h3 className="text-lg sm:text-xl font-poppins font-semibold text-[#78716c] mb-2">
              {project.name}
            </h3>
            <p className="text-xs sm:text-sm font-roboto text-[#0c0a09] text-center">
              {project.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Myportfolio;

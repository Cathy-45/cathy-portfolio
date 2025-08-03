import React from 'react';
import { Link } from 'react-router-dom';

const Products = () => {
  const services = [
    {
      id: 1,
      name: 'Full-Stack Development',
      description: 'Build robust applications using React, Node.js, JavaScript, Html, Python, and more. lets create something amazing together!',
      bgColor: 'bg-[#ff6f61]', 
      path: '/products/full-stack-development',
    },
    {
      id: 2,
      name: 'Technology Consulting',
      description: 'Align software solutions with your business objectives for growth and efficiency.',
      bgColor: 'bg-[#4CAF50]', 
      path: '/products/technology-consulting',
    },
    {
      id: 3,
      name: 'System Integration',
      description: 'Connect CRMs, ERPs, and APIs for seamless data flows.',
      bgColor: 'bg-[#1E90FF]', 
      path: '/products/system-integration',
    },
    {
      id: 4,
      name: 'SaaS/Agile DevOps',
      description: 'Scalable software-as-a-service solutions.',
      bgColor: 'bg-[#FFD700]', 
      path: '/products/saas',
    },
  ];

  return (
    <section className="min-h-screen bg-[#1a1a1a] text-white sm:p-6 md:p-10">
      <h2 className="text-6xl sm:text-4xl md:text-5xl lg:text-6xl font-poppins font-bold mb-16 mb-8 sm:mb-12 md text-center text-[#fdba74]">
        My Services
      </h2>
      <div className="grid grid-cols-2 gap-6 sm:gap-8 md:gap-14 max-w-4xl mx-auto text-[#fb7185]">
        {services.map((service) => (
          <Link
            key={service.id}
            to={service.path}
            className={`${service.bgColor} w-128 h-64 rounded-lg shadow-xl flex flex-col items-center justify-center p-8 hover:opacity-90 transition-opacity`}
          >
            <h3 className="text-lg sm:text-xl font-poppins font-semibold text-[#78716c] mb-2">
              {service.name}
            </h3>
            <p className="text-xs sm:text-sm font-roboto text-[#0c0a09] text-center">
              {service.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Products;
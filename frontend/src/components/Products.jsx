  import React from 'react';
import { Link } from 'react-router-dom';

const services = [
  {
    id: 1,
    name: 'Full-Stack Development',
    description: 'Build robust applications using React, Node.js, JavaScript, Html, Python, and more. Let’s create something amazing together!',
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

const Products = () => {
  return (
    <section className="min-h-screen bg-[#1a1a1a] text-white p-4 sm:p-6 md:p-10">
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-poppins font-bold mb-8 sm:mb-12 md:text-center text-[#fdba74]">
        My Services
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 md:gap-16 max-w-6xl mx-auto">
        {services.map((service) => (
          <Link
            key={service.id}
            to={service.path}
            className={`${service.bgColor} rounded-lg shadow-xl flex flex-col items-center justify-center p-6 sm:p-8 hover:opacity-90 transition-opacity w-full min-h-[20rem] sm:min-h-[22rem]`}
          >
            <h3 className="text-lg sm:text-xl font-poppins font-semibold text-[#78716c] mb-4 text-center">
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
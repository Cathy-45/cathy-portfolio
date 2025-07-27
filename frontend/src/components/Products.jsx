import React from 'react';

const Products = () => {
  const services = [
    { id: 1, name: 'Web Development', description: 'Custom websites tailored to your needs.' },
    { id: 2, name: 'Technology Consulting', description: 'Expert advice to optimize your tech stack.' },
    { id: 3, name: 'System Integration', description: 'Seamless integration of your systems.' },
    { id: 4, name: 'SaaS', description: 'Scalable software-as-a-service solutions.' },
  ];

  return (
    <section className="min-h-screen bg-[#1a1a1a] text-gray p-8">
      <h2 className="text-4xl font-poppins font-bold mb-8 text-center text-coral">My Services</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map(service => (
          <div
            key={service.id}
            className="w-48 h-48 bg-[#4b5563] rounded-lg shadow-lg flex flex-col items-center justify-center p-4 hover:bg-[#3a3a3a] transition-colors"
          >
            <h3 className="text-xl font-poppins font-semibold text-coral mb-2">{service.name}</h3>
            <p className="text-sm font-roboto text-green text-center">{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Products;
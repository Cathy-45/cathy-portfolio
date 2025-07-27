import React from 'react';

const Products = () => {
  const services = [
    { id: 1, name: 'Web Development', description: 'Custom websites tailored to your needs.' },
    { id: 2, name: 'Technology Consulting', description: 'Expert advice to optimize your tech stack.' },
    { id: 3, name: 'System Integration', description: 'Seamless integration of your systems.' },
    { id: 4, name: 'SaaS', description: 'Scalable software-as-a-service solutions.' },
  ];

  return (
    <section className="min-h-screen bg-[#1a1a1a] text-white p-8">
      <h2 className="text-4xl font-poppins font-bold mb-8 text-center">My Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map(service => (
          <div key={service.id} className="p-6 bg-[#2a2a2a] rounded-lg shadow-lg">
            <h3 className="text-2xl font-poppins">{service.name}</h3>
            <p className="font-roboto">{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Products;
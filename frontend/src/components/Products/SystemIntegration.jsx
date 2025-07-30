import React from 'react';
import { Link } from 'react-router-dom';
import backgroundImage from '../../assets/background.jpg'; // Adjust path if needed

const SystemIntegration = () => {
  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center bg-[#1a1a1a] text-white bg-contain bg-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundBlendMode: 'overlay',
        backgroundColor: 'rgba(26, 26, 26, 0.96)',
        opacity: 0.3,
        backgroundPosition: 'center top',
      }}
    >
      <h2 className="text-6xl font-poppins font-bold mb-8 text-center text-[#fdba74]">
        System Integration
      </h2>
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-4">
        <div className="bg-[#2a2a2a] rounded-lg p-8 shadow-xl w-full">
          <p className="text-xl font-roboto font-light text-[#9ca3af] leading-relaxed mb-4">
            Our System Integration service connects your CRMs, ERPs, and APIs to enable seamless data flows across your 
            organization. We design and implement solutions that integrate platforms like Salesforce, SAP, or custom APIs, 
            reducing manual processes and improving operational efficiency.
          </p>
          <hr className="border-[#fdba74] border-opacity-50 my-4 w-1/2 mx-auto" />
          <p className="text-xl font-roboto font-light text-[#9ca3af] leading-relaxed mb-4">
            Benefits include real-time data synchronization, automated workflows, and scalable infrastructure to support 
            your business as it grows.
          </p>
        </div>
        <Link
          to="/products"
          className="text-[#fdba74] hover:underline font-poppins text-lg"
        >
          Back to Services
        </Link>
        <Link
          to="/consultation"
          className="text-lg font-poppins text-white bg-[#fdba74] hover:bg-[#fb923c] px-6 py-2 rounded-lg transition-colors mt-6"
        >
          Book A Consultation Now!
        </Link>
      </div>
    </section>
  );
};

export default SystemIntegration;
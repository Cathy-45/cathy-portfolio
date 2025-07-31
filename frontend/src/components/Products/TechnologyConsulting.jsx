import React from "react";
import { Link } from "react-router-dom";
import backgroundImage from "../../assets/background.jpg"; // Adjust path if needed

const TechnologyConsulting = () => {
  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center bg-[#1a1a1a] text-white bg-contain bg-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundBlendMode: "overlay",
        backgroundColor: "rgba(26, 26, 26, 0.96)",
        opacity: 0.3,
        backgroundPosition: "center top",
      }}
    >
      <h2 className="text-6xl font-poppins font-bold mb-8 text-center text-[#fdba74]">
        Technology Consulting
      </h2>
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-4">
        <div className="bg-[#2a2a2a] rounded-lg p-8 shadow-xl w-full">
          <p className="text-xl font-roboto font-light text-[#9ca3af] leading-relaxed mb-4">
            Our Technology Consulting service helps align your software
            solutions with your business goals for maximum efficiency and
            growth. We assess your current technology stack, identify
            bottlenecks, and provide tailored recommendations to optimize
            performance. From startups to enterprises, we guide you in selecting
            the right tools and strategies.
          </p>
          <hr className="border-[#fdba74] border-opacity-50 my-4 w-1/2 mx-auto" />
          <p className="text-xl font-roboto font-light text-[#9ca3af] leading-relaxed mb-4">
            Services include technology audits, cloud migration strategies,
            cybersecurity planning, and team training to ensure your business
            thrives in the digital age.
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
          className="text-lg font-poppins text-white bg-[#3F3F46] hover:bg-[#fb923c] px-6 py-2 rounded-lg transition-colors mt-6"
        >
          Book A Consultation Now!
        </Link>
      </div>
    </section>
  );
};

export default TechnologyConsulting;

import React from "react";
import { Link } from "react-router-dom";
import backgroundImage from "../../assets/background.jpg";

const FullStackDevelopment = () => {
  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center bg-[#1a1a1a] text-white bg-contain bg-center p-4 sm:p-6 md:p-10"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundBlendMode: "overlay",
        backgroundColor: "rgba(26, 26, 26, 0.96)",
        opacity: 0.3,
        backgroundPosition: "center top",
      }}
    >
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-poppins font-bold mb-6 sm:mb-8 text-center text-[#fdba74]">
        Full-Stack Development
      </h2>
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-4">
        <div className="bg-[#2a2a2a] rounded-lg p-4 sm:p-6 md:p-8 shadow-xl w-full">
          <p className="text-base sm:text-lg md:text-xl font-roboto font-light text-[#9ca3af] leading-relaxed mb-4">
            Our Full-Stack Development service delivers end-to-end web
            applications tailored to your business needs. We leverage modern
            technologies like React for dynamic, responsive frontends and
            Node.js for scalable, efficient backends, alongside JavaScript,
            HTML, Python, and more. Whether you need an e-commerce platform, a
            business dashboard, or a custom web app, we ensure high performance,
            security, and an exceptional user experience.
          </p>
          <hr className="border-[#fdba74] border-opacity-50 my-2 sm:my-4 w-3/4 sm:w-1/2 mx-auto" />
          <p className="text-base sm:text-lg md:text-xl font-roboto font-light text-[#9ca3af] leading-relaxed mb-4">
            Key features include responsive design, database integration (e.g.,
            MongoDB, PostgreSQL), RESTful or GraphQL APIs, and ongoing support
            to keep your application up-to-date and competitive.
          </p>
        </div>
        <Link
          to="/products"
          className="text-sm sm:text-lg font-poppins text-[#fdba74] hover:underline"
        >
          Back to Services
        </Link>
        <Link
          to="/consultation"
          className="text-sm sm:text-lg font-poppins text-white bg-[#3F3F46] hover:bg-[#fb923c] px-4 sm:px-6 py-2 rounded-lg transition-colors mt-4 sm:mt-6"
        >
          Book A Consultation Now!
        </Link>
      </div>
    </section>
  );
};

export default FullStackDevelopment;
